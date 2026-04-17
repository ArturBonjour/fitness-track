#!/usr/bin/env python3
"""
convert_diploma.py — конвертация дипломной работы из Markdown в DOCX.

Требования:
    pip install python-docx

Использование:
    python3 convert_diploma.py                        # создаёт diploma.docx рядом со скриптом
    python3 convert_diploma.py -o /path/to/output.docx

Форматирование соответствует требованиям методических указаний КФУ (КАДиТП, 2025):
  - Шрифт Times New Roman 14 пт, полуторный интервал
  - Поля: верхнее 20 мм, нижнее 20 мм, правое 15 мм, левое 30 мм
  - Абзацный отступ основного текста 1.25 см
  - Заголовки по центру, без жирного, без курсива, без точки в конце
  - Нумерация страниц снизу по центру, Times New Roman 12 пт
  - Таблицы и рисунки по правилам методических указаний
"""

import argparse
import re
import sys
from pathlib import Path

from docx import Document
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


SOURCE_MD = Path(__file__).parent / "diploma_ch1_draft.md"
DEFAULT_OUT = Path(__file__).parent / "diploma.docx"

FONT_NAME = "Times New Roman"
FONT_SIZE_MAIN = 14          # пт — основной текст
FONT_SIZE_HEADING = 14       # пт — заголовки (методичка: такой же)
FONT_SIZE_PAGE_NUM = 12      # пт — номер страницы

LINE_SPACING_MAIN = 276      # 1.5 × 12240/72 ≈ 276 twips (полуторный)

MARGIN_TOP    = Cm(2.0)
MARGIN_BOTTOM = Cm(2.0)
MARGIN_LEFT   = Cm(3.0)
MARGIN_RIGHT  = Cm(1.5)

PARA_INDENT   = Cm(1.25)     # абзацный отступ основного текста
PARA_SPACE_AFTER_MAIN = 0    # пт — между абзацами основного текста


# ---------------------------------------------------------------------------
# Helpers — низкоуровневые операции над XML OOXML
# ---------------------------------------------------------------------------

def set_page_margins(doc: Document):
    """Задаёт поля страницы согласно методическим указаниям."""
    section = doc.sections[0]
    section.top_margin    = MARGIN_TOP
    section.bottom_margin = MARGIN_BOTTOM
    section.left_margin   = MARGIN_LEFT
    section.right_margin  = MARGIN_RIGHT


def add_page_numbers(doc: Document):
    """Добавляет сквозную нумерацию страниц снизу по центру."""
    section = doc.sections[0]
    footer = section.footer
    para = footer.paragraphs[0]
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run()

    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    run._r.append(fld_begin)

    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    run._r.append(instr)

    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run._r.append(fld_end)

    run.font.name = FONT_NAME
    run.font.size = Pt(FONT_SIZE_PAGE_NUM)


def _set_paragraph_format(para, indent_first: bool = True, alignment=WD_ALIGN_PARAGRAPH.JUSTIFY):
    """Применяет единые настройки абзаца для основного текста."""
    fmt = para.paragraph_format
    fmt.alignment = alignment
    fmt.space_after = Pt(PARA_SPACE_AFTER_MAIN)
    fmt.line_spacing = Pt(LINE_SPACING_MAIN / 20)   # ≈ 13.8 пт (~1.5)
    if indent_first:
        fmt.first_line_indent = PARA_INDENT
    else:
        fmt.first_line_indent = Pt(0)


def _apply_font(run, size=FONT_SIZE_MAIN, bold=False, italic=False):
    run.font.name = FONT_NAME
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic


# ---------------------------------------------------------------------------
# Парсер Markdown → Document
# ---------------------------------------------------------------------------

class DiplomaMdParser:
    """
    Упрощённый парсер подмножества Markdown, используемого в дипломе.
    Поддерживает: заголовки #/##/###, параграфы, нумерованные и маркированные
    списки, таблицы, блоки кода, горизонтальные разделители.
    """

    HEADING_RE   = re.compile(r"^(#{1,6})\s+(.*)")
    HR_RE        = re.compile(r"^-{3,}$")
    ORDERED_RE   = re.compile(r"^\d+\.\s+(.*)")
    UNORDERED_RE = re.compile(r"^[-–]\s+(.*)")
    TABLE_ROW_RE = re.compile(r"^\|")
    CODE_START   = "```"

    def __init__(self, doc: Document):
        self.doc = doc
        self._in_code = False
        self._code_lang = ""
        self._code_lines: list[str] = []
        self._table_rows: list[list[str]] = []
        self._in_table = False
        self._figure_counter = 0

    def parse(self, text: str):
        lines = text.splitlines()
        i = 0
        while i < len(lines):
            line = lines[i]

            # --- code block ---
            if line.startswith(self.CODE_START):
                if not self._in_code:
                    self._flush_table()
                    self._in_code = True
                    self._code_lang = line[3:].strip()
                    self._code_lines = []
                else:
                    self._flush_code()
                    self._in_code = False
                i += 1
                continue

            if self._in_code:
                self._code_lines.append(line)
                i += 1
                continue

            # --- horizontal rule (ignore — used only in title) ---
            if self.HR_RE.match(line):
                i += 1
                continue

            # --- table row ---
            if self.TABLE_ROW_RE.match(line):
                self._in_table = True
                cells = [c.strip() for c in line.strip("|").split("|")]
                # skip separator rows like |---|---|
                if all(re.match(r"^[-: ]+$", c) for c in cells):
                    i += 1
                    continue
                self._table_rows.append(cells)
                i += 1
                continue
            else:
                if self._in_table:
                    self._flush_table()

            # --- heading ---
            m = self.HEADING_RE.match(line)
            if m:
                level = len(m.group(1))
                text_content = m.group(2).strip()
                self._add_heading(text_content, level)
                i += 1
                continue

            # --- ordered list item ---
            m = self.ORDERED_RE.match(line)
            if m:
                self._add_list_item(m.group(1), ordered=True)
                i += 1
                continue

            # --- unordered list item ---
            m = self.UNORDERED_RE.match(line)
            if m:
                self._add_list_item(m.group(1), ordered=False)
                i += 1
                continue

            # --- empty line ---
            if not line.strip():
                i += 1
                continue

            # --- regular paragraph ---
            self._add_paragraph(line)
            i += 1

        self._flush_table()
        if self._in_code:
            self._flush_code()

    # -----------------------------------------------------------------------

    def _add_heading(self, text: str, level: int):
        """Добавляет заголовок. Уровень 1 — глава, 2 — подглава, 3 — подподглава."""
        # Remove markdown bold markers from TOC headings
        text = text.replace("**", "")

        para = self.doc.add_paragraph()
        fmt = para.paragraph_format
        fmt.alignment = WD_ALIGN_PARAGRAPH.CENTER
        fmt.first_line_indent = Pt(0)
        fmt.space_before = Pt(12) if level > 1 else Pt(0)
        fmt.space_after  = Pt(12)
        fmt.line_spacing = Pt(LINE_SPACING_MAIN / 20)

        run = para.add_run(text)
        run.font.name = FONT_NAME
        run.font.size = Pt(FONT_SIZE_HEADING)
        run.font.bold  = False
        run.font.italic = False

        # Apply Word heading style so the TOC can be generated
        style_map = {1: "Heading 1", 2: "Heading 2", 3: "Heading 3", 4: "Heading 4"}
        if level in style_map:
            try:
                para.style = self.doc.styles[style_map[level]]
            except KeyError:
                pass

    def _add_paragraph(self, text: str):
        """Добавляет параграф основного текста с разбором inline-разметки."""
        # Detect figure captions: "Рисунок N."
        is_caption = bool(re.match(r"^Рисунок\s+\d+", text))

        para = self.doc.add_paragraph()
        _set_paragraph_format(para, indent_first=not is_caption,
                              alignment=WD_ALIGN_PARAGRAPH.CENTER if is_caption
                                        else WD_ALIGN_PARAGRAPH.JUSTIFY)
        if is_caption:
            para.paragraph_format.space_before = Pt(0)
            para.paragraph_format.space_after  = Pt(12)

        self._add_inline_text(para, text)

    def _add_list_item(self, text: str, ordered: bool):
        para = self.doc.add_paragraph()
        fmt = para.paragraph_format
        fmt.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        fmt.first_line_indent = Pt(0)
        fmt.left_indent = PARA_INDENT
        fmt.space_after  = Pt(0)
        fmt.line_spacing = Pt(LINE_SPACING_MAIN / 20)
        prefix = "– " if not ordered else ""
        self._add_inline_text(para, prefix + text)

    def _add_inline_text(self, para, text: str):
        """Разбирает inline **bold**, `code` и добавляет runs."""
        # Split on bold and inline code markers
        token_re = re.compile(r"(\*\*.*?\*\*|`[^`]+`)")
        parts = token_re.split(text)
        for part in parts:
            if not part:
                continue
            if part.startswith("**") and part.endswith("**"):
                content = part[2:-2]
                run = para.add_run(content)
                _apply_font(run, bold=False)  # методичка запрещает bold в тексте
            elif part.startswith("`") and part.endswith("`"):
                content = part[1:-1]
                run = para.add_run(content)
                run.font.name = "Courier New"
                run.font.size = Pt(12)
            else:
                run = para.add_run(part)
                _apply_font(run)

    def _flush_code(self):
        """Добавляет блок кода как параграф Courier New 12 пт."""
        if not self._code_lines:
            return
        # Add all code lines as a single paragraph with line breaks
        para = self.doc.add_paragraph()
        fmt = para.paragraph_format
        fmt.alignment = WD_ALIGN_PARAGRAPH.LEFT
        fmt.first_line_indent = Pt(0)
        fmt.left_indent = Pt(0)
        fmt.space_before = Pt(6)
        fmt.space_after  = Pt(6)
        fmt.line_spacing = Pt(18)  # 1.5 × 12 пт Courier

        for idx, code_line in enumerate(self._code_lines):
            run = para.add_run(code_line)
            run.font.name = "Courier New"
            run.font.size = Pt(12)
            if idx < len(self._code_lines) - 1:
                run.add_break()

        self._code_lines = []
        self._code_lang = ""

    def _flush_table(self):
        """Добавляет накопленные строки таблицы как Word-таблицу."""
        if not self._table_rows:
            self._in_table = False
            return

        rows = self._table_rows
        col_count = max(len(r) for r in rows)

        table = self.doc.add_table(rows=len(rows), cols=col_count)
        table.style = "Table Grid"

        for r_idx, row_data in enumerate(rows):
            row = table.rows[r_idx]
            for c_idx, cell_text in enumerate(row_data):
                if c_idx >= col_count:
                    break
                cell = row.cells[c_idx]
                cell.text = ""
                # Remove bold markers
                cell_text_clean = cell_text.replace("**", "")
                para = cell.paragraphs[0]
                para.alignment = (WD_ALIGN_PARAGRAPH.CENTER if r_idx == 0
                                  else WD_ALIGN_PARAGRAPH.JUSTIFY)
                run = para.add_run(cell_text_clean)
                run.font.name = FONT_NAME
                run.font.size = Pt(FONT_SIZE_MAIN)
                run.font.bold = (r_idx == 0)

        self._table_rows = []
        self._in_table = False

        # Add space after table
        self.doc.add_paragraph()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def build_docx(source_md: Path, output_path: Path):
    doc = Document()

    # Page setup
    set_page_margins(doc)
    add_page_numbers(doc)

    # Default style — Times New Roman 14 пт
    style = doc.styles["Normal"]
    font = style.font
    font.name = FONT_NAME
    font.size = Pt(FONT_SIZE_MAIN)

    # Parse MD
    parser = DiplomaMdParser(doc)
    text = source_md.read_text(encoding="utf-8")

    # Strip YAML front-matter (--- ... ---)
    text = re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.DOTALL)

    parser.parse(text)

    doc.save(str(output_path))
    print(f"[OK] Сохранено: {output_path}")
    print(f"     Страниц (ориентировочно): ~{len(doc.paragraphs) // 25 + 1}")


def main():
    ap = argparse.ArgumentParser(description="Конвертация diploma_ch1_draft.md → DOCX")
    ap.add_argument("-i", "--input",  default=str(SOURCE_MD),
                    help="Входной Markdown-файл (по умолчанию: diploma_ch1_draft.md)")
    ap.add_argument("-o", "--output", default=str(DEFAULT_OUT),
                    help="Выходной DOCX-файл (по умолчанию: diploma.docx)")
    args = ap.parse_args()

    src = Path(args.input)
    out = Path(args.output)

    if not src.exists():
        print(f"[ОШИБКА] Файл не найден: {src}", file=sys.stderr)
        sys.exit(1)

    out.parent.mkdir(parents=True, exist_ok=True)
    build_docx(src, out)


if __name__ == "__main__":
    main()

# Bogdanov FitTrack

Полнофункциональное веб-приложение персонального фитнес-мониторинга, разработанное как выпускная квалификационная работа в Казанском Федеральном Университете (направление «Прикладная информатика», группа 09-253).

---

## Содержание

- [Описание](#описание)
- [Возможности](#возможности)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Быстрый старт](#быстрый-старт)
- [API](#api)
- [Структура проекта](#структура-проекта)
- [Скрипты](#скрипты)
- [Автор](#автор)

---

## Описание

**Bogdanov FitTrack** — веб-приложение для комплексного ведения персональных тренировок и фитнес-целей. Решает задачу, которую не закрывают топовые аналоги (Strava, MyFitnessPal, Google Fit) в бесплатном режиме: сочетает calendar-ориентированное планирование, управление целями с автоматическим трекингом прогресса, калькулятор калорий по формуле Харриса-Бенедикта и персонализированные рекомендации — всё в одном легковесном веб-приложении с темной темой.

---

## Возможности

### Аутентификация и безопасность
- Регистрация с многошаговой валидацией (email, пароль, физические параметры)
- Вход с JWT (7 дней) и автоматическим обновлением заголовка Axios
- Защита от перебора паролей — rate-limiting: 5 попыток / 15 минут (OWASP-рекомендация)
- bcrypt-хэширование паролей (10 раундов соли)
- Изоляция данных между пользователями на уровне каждого API-маршрута
- Автоматический выход при истечении токена (HTTP 401 → глобальный Axios interceptor)
- Перенаправление аутентифицированного пользователя с /login и /register на главную
- Аватар с инициалом имени в шапке (как у Google / Strava)

### Тренировки
- Интерактивный месячный календарь с цветными бейджами
- Создание тренировки кликом по дню (предзаполненная дата)
- Emoji-пиктограммы типов тренировок вместо обычного select
- Ползунок продолжительности 5–180 минут с live-обновлением
- Фильтруемый список тренировок на странице профиля

### Фитнес-цели
- Создание цели с типом, единицей измерения и дедлайном
- Предпросмотр прогресса (зеленая полоса) прямо в форме
- Автоматическое определение выполнения цели на сервере (алгоритм учитывает направление: набор / снижение)
- Прогресс-бары на странице профиля с цветовым индикатором срока

### Аналитика и виджеты
- StatsWidget: тренировки за неделю / месяц, серия дней (streak), любимый тип, ИМТ с категорией ВОЗ
- График динамики веса (линейный, Chart.js)
- График недельной активности (столбчатый, Chart.js)
- Калькулятор калорий BMR/TDEE по формуле Харриса-Бенедикта
- Персонализированные рекомендации по цели и уровню подготовки

### Интерфейс
- Адаптивный дизайн: 320 px (мобильный) — 1920 px (десктоп)
- Темная / светлая тема (class-стратегия Tailwind, сохраняется в localStorage)
- Skeleton-загрузка вместо спиннеров (StatsWidget, Recommendations)
- Toast-уведомления (slideInRight, прогресс-бар, 4 типа)
- Модальные окна через ReactDOM.createPortal с backdrop-blur и Escape-закрытием
- Индикатор силы пароля при регистрации (4 уровня)

---

## Технологический стек

| Слой | Технология | Версия |
|---|---|---|
| Frontend | React | 18 |
| Frontend | React Router | 6 |
| Frontend | Tailwind CSS | 3 |
| Frontend | Chart.js + react-chartjs-2 | 4 |
| Frontend | Axios | 1 |
| Frontend | Day.js | 1 |
| Backend | Node.js | 20+ |
| Backend | Express | 4 |
| Backend | jsonwebtoken | 9 |
| Backend | bcryptjs | 2 |
| Backend | express-validator | 7 |
| Backend | express-rate-limit | 7 |
| Database | MongoDB | 6+ |
| Database | Mongoose | 8 |

---

## Архитектура

```
┌──────────────────────────────────────────────────────────┐
│                  КЛИЕНТСКАЯ ЧАСТЬ (SPA)                   │
│  React · React Router · Context API · Tailwind CSS        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐  │
│  │ Calendar │ │ Profile  │ │ Calorie Calc │ │ Widgets │  │
│  └──────────┘ └──────────┘ └──────────────┘ └─────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │  HTTP / REST (JSON)
                         │  Authorization: Bearer <JWT>
┌────────────────────────▼─────────────────────────────────┐
│              СЕРВЕРНАЯ ЧАСТЬ (Node.js / Express)          │
│  /api/auth · /api/workouts · /api/goals · /api/users      │
│  Middleware: JWT auth · express-validator · rate-limit     │
└────────────────────────┬─────────────────────────────────┘
                         │  Mongoose ODM
┌────────────────────────▼─────────────────────────────────┐
│                        MongoDB                            │
│     users · workouts · goals · workoutRecommendations     │
└──────────────────────────────────────────────────────────┘
```

Трехуровневая клиент-серверная архитектура с принципом loose coupling. Клиент взаимодействует с сервером исключительно через REST API; сервер работает с базой данных через Mongoose ODM.

---

## Быстрый старт

### Вариант А — Docker (рекомендуется, требует Docker Desktop)

> **Важно:** перед запуском отключите VPN. Docker использует внутреннюю DNS-сеть bridge (`127.0.0.11`) для разрешения имён контейнеров (`mongo`). Большинство VPN-клиентов перехватывают DNS-трафик и нарушают эту маршрутизацию, из-за чего контейнер приложения не может найти MongoDB.

```bash
git clone https://github.com/ArturBonjour/fitness-track.git
cd fitness-track
docker compose up --build
```

Приложение доступно по адресу: http://localhost:5001

> **Подсказка:** Docker Compose v2 в интерактивном режиме перехватывает нажатия клавиш. Нажатие `d` **отсоединяет** (detach) терминал от потока логов, не останавливая контейнеры — это нормальное поведение. Для полной остановки используйте `Ctrl+C` или `docker compose down`.

Для инициализации рекомендаций после первого запуска:

```bash
docker compose exec app node scripts/initRecommendations.js
```

---

### Вариант Б — локальный запуск

#### Требования

- Node.js >= 20
- MongoDB (локальный экземпляр или MongoDB Atlas)
- npm >= 9

#### 1. Клонирование

```bash
git clone https://github.com/ArturBonjour/fitness-track.git
cd fitness-track
```

#### 2. Настройка Backend

```bash
cd server
npm install
```

Создайте файл `server/.env` (см. `.env.example` в корне):

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitness-tracker
JWT_SECRET=your_very_long_random_secret_here
PORT=5001
```

Инициализация начальных рекомендаций:

```bash
npm run init-recommendations
```

#### 3. Настройка Frontend

```bash
cd ../client
npm install
```

#### 4. Запуск (режим разработки)

В двух терминалах:

```bash
# Терминал 1 — Backend
cd server && npm run dev

# Терминал 2 — Frontend
cd client && npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

#### 5. Production-сборка

```bash
cd client && npm run build
cd ../server && npm start
```

Сервер автоматически раздает статические файлы React в режиме `production`.

---

## API

### Аутентификация

| Метод | Путь | Auth | Описание |
|---|---|---|---|
| POST | /api/auth/register | — | Регистрация пользователя |
| POST | /api/auth/login | — | Вход, возврат JWT |
| GET | /api/auth/user | JWT | Данные текущего пользователя |
| POST | /api/auth/logout | JWT | Выход |

### Тренировки

| Метод | Путь | Auth | Описание |
|---|---|---|---|
| GET | /api/workouts | JWT | Все тренировки пользователя |
| GET | /api/workouts/:id | JWT | Тренировка по ID |
| GET | /api/workouts/date/:date | JWT | Тренировки за дату |
| GET | /api/workouts/range/:start/:end | JWT | Тренировки за период |
| POST | /api/workouts | JWT | Создать тренировку |
| PUT | /api/workouts/:id | JWT | Обновить тренировку |
| DELETE | /api/workouts/:id | JWT | Удалить тренировку |

### Цели

| Метод | Путь | Auth | Описание |
|---|---|---|---|
| GET | /api/goals | JWT | Список целей |
| POST | /api/goals | JWT | Создать цель |
| PUT | /api/goals/:id | JWT | Обновить цель |
| PUT | /api/goals/:id/progress | JWT | Обновить прогресс (с автопроверкой) |
| DELETE | /api/goals/:id | JWT | Удалить цель |

### Профиль и рекомендации

| Метод | Путь | Auth | Описание |
|---|---|---|---|
| PUT | /api/users/profile | JWT | Обновить профиль |
| GET | /api/users/weight-history | JWT | История веса (последние 30 записей) |
| GET | /api/recommendations | — | Все рекомендации |
| GET | /api/recommendations/:goal/:level | — | Рекомендация по цели и уровню |

---

## Структура проекта

```
fitness-track/
├── client/                        # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                 # Маршрутизация, PrivateRoute
│   │   ├── index.css              # Tailwind + кастомные анимации
│   │   ├── pages/
│   │   │   ├── Home.js            # Главная: Календарь + боковая панель
│   │   │   ├── Profile.js         # Профиль, графики Chart.js, цели
│   │   │   ├── Login.js           # Форма входа (eye-button, auto-redirect)
│   │   │   ├── Register.js        # Многошаговая форма, индикатор пароля
│   │   │   └── NotFound.js        # 404-страница
│   │   ├── components/
│   │   │   ├── Header.js          # Навигация, аватар, тема
│   │   │   ├── Footer.js          # Градиентный футер с модальным окном
│   │   │   ├── Calendar.js        # Интерактивный месячный календарь
│   │   │   ├── WorkoutForm.js     # Форма тренировки (emoji, ползунок)
│   │   │   ├── GoalForm.js        # Форма цели (предпросмотр прогресса)
│   │   │   ├── StatsWidget.js     # Дашборд статистики
│   │   │   ├── CalorieCalculator.js  # BMR/TDEE по Харрису-Бенедикту
│   │   │   ├── WorkoutRecommendations.js
│   │   │   ├── Modal.js           # Portal + backdrop-blur + Escape
│   │   │   └── Notification.js    # Toast-очередь
│   │   ├── context/
│   │   │   ├── AuthContext.js     # Сессия: login/logout/register/updateUser
│   │   │   ├── ThemeContext.js    # dark/light переключение
│   │   │   └── NotificationContext.js  # Глобальные toast
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useAxiosInterceptor.js  # 401 → auto-logout
│   │   └── services/
│   │       └── localStorageService.js
│   └── tailwind.config.js         # Токены, анимации, dark-стратегия
│
├── server/                        # Node.js REST API
│   ├── server.js                  # Точка входа
│   ├── middleware/
│   │   └── auth.js                # JWT-верификация Bearer-токена
│   ├── models/
│   │   ├── User.js                # users: профиль + weightHistory
│   │   ├── Workout.js             # workouts
│   │   ├── Goal.js                # goals
│   │   └── WorkoutRecommendation.js
│   ├── routes/
│   │   ├── auth.js                # Регистрация, вход, rate-limiting
│   │   ├── workouts.js            # CRUD тренировок
│   │   ├── goals.js               # CRUD целей + прогресс
│   │   ├── users.js               # Профиль, история веса
│   │   └── workoutRecommendations.js
│   └── scripts/
│       └── initRecommendations.js # Начальные данные
│
├── Dockerfile                         # Многоэтапная сборка (React → Express)
├── docker-compose.yml                 # MongoDB + приложение одной командой
├── .env.example                       # Шаблон переменных окружения
├── diploma_ch1_draft.md               # Дипломная работа (ВКР)
└── README.md
```

---

## Скрипты

### Frontend

```bash
cd client
npm start                                           # dev-сервер (port 3000)
npm run build                                       # production-сборка
npm test -- --watchAll=false --passWithNoTests      # CI-тесты
```

### Backend

```bash
cd server
npm start                    # запуск сервера
npm run dev                  # запуск с nodemon (hot-reload)
npm run init-recommendations # заполнить коллекцию рекомендаций
```

---

## Автор

Богданов Артур Владимирович  
КФУ, ИВМиИТ, направление «Прикладная информатика», группа 09-253, 2025


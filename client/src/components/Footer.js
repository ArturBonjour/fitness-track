import React, { useState } from 'react';
import Modal from './Modal';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    return (
        <footer className="bg-gradient-to-r from-primary to-primary-light text-white py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-sm text-white/80">
                        © {currentYear}{' '}
                        <span className="font-semibold text-white">BogdanovFitTrack</span>
                        . Все права защищены.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAboutModalOpen(true)}
                            className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                            О проекте
                        </button>
                        <span className="text-white/30">·</span>
                        <span className="text-xs text-white/50">КФУ 2025</span>
                    </div>
                </div>
            </div>

            {/* Модальное окно "О проекте" */}
            <Modal
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)}
                title="О проекте"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-md shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100">Bogdanov FitTrack</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Персональный фитнес-монитор</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Выпускная квалификационная работа, выполненная студентом
                        Казанского Федерального Университета, направление «Прикладная
                        информатика», группа 09-253, <strong>Богдановым Артуром Владимировичем</strong>.
                    </p>
                    <div className="flex justify-end pt-1">
                        <button
                            onClick={() => setIsAboutModalOpen(false)}
                            className="btn-press px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </Modal>
        </footer>
    );
};

export default Footer; 
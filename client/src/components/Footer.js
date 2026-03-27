import React, { useState } from 'react';
import Modal from './Modal';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    return (
        <footer className="bg-primary text-white py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">© {currentYear} BogdanovFitTrack. Все права защищены.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => setIsAboutModalOpen(true)} 
                            className="text-sm hover:text-gray-300"
                        >
                            О нас
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно "О нас" */}
            <Modal 
                isOpen={isAboutModalOpen} 
                onClose={() => setIsAboutModalOpen(false)}
                title="О нас"
            >
                <div className="space-y-4">
                    <p>
                        Данная работа выполнена студентом Казанского Федерального Университета, 
                        направление Прикладная информатика, группа 09-253, 
                        Богдановым Артуром Владимировичем.
                    </p>
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setIsAboutModalOpen(false)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
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
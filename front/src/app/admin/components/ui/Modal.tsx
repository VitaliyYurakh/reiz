'use client';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
}

export default function Modal({ isOpen, onClose, title, children, onSubmit }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="overlay fixed-block active mode" data-overlay onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <form className="cabinet-modal modal mode active" style={{display: 'flex', opacity: 1}} onSubmit={onSubmit}>
                <div className="modal__top">
                    <span className="modal__title">{title}</span>
                    <div className="modal__btns">
                        {onSubmit && <button type="submit" className="grey-btn">Сохранить</button>}
                        <button type="button" className="grey-btn close" onClick={onClose}>Назад</button>
                    </div>
                </div>
                <div className="modal__box mode">
                    {children}
                </div>
            </form>
        </div>
    );
}

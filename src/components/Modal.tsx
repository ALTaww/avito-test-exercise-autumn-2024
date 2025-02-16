import React, { useEffect, useRef } from "react";
import "../css/modal.css";

interface IComponent {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IComponent> = ({ isOpen, onClose, children }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Закрытие модального окна при клике вне его области
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Если модальное окно закрыто, не рендерим его
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalContentRef}>
        <button className="modal-close-button" onClick={onClose}>
          &times; {/* Крестик для закрытия */}
        </button>
        {children} {/* Контент модального окна */}
      </div>
    </div>
  );
};

export default Modal;

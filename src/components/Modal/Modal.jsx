import { useEffect } from 'react';
import icon from '../../../public/icons/sprite.svg';
import css from './Modal.module.css';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} type="button" onClick={onClose}>
          <svg className={css.btnIcon} width={22} height={22}>
            <use href={`${icon}#closeBtn`}></use>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

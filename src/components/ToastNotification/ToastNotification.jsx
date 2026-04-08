import { useEffect } from 'react';
import icon from '../../../public/icons/sprite.svg';
import css from './ToastNotification.module.css';

export default function ToastNotification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={css.notification}>
      <p>{message}</p>
      <button onClick={onClose} className={css.closeBtn}>
        <svg className={css.icon} width={20} height={20}>
          <use href={`${icon}#closeBtn`} />
        </svg>
      </button>
    </div>
  );
}

import Modal from '../Modal/Modal';
import css from './CommonModal.module.css';

export default function CommonModal({ onClose, isOpen, picture, title, text }) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={css.wrapper}>
        <img src={picture} alt="picture" className={css.image} />
        <div className={css.textWrapper}>
          <h2 className={css.title}>{title}</h2>
          {text}
        </div>
      </div>
    </Modal>
  );
}

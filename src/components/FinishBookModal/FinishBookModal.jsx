import CommonModal from '../CommonModal/CommonModal';
import css from '../SuccessModal/SuccessModal.module.css';

export default function FinishBookModal({ onClose, isOpen }) {
  const picture = 'images/books@2x.png';
  const title = 'The book is read';
  const text = (
    <p className={css.text}>
      It was an <span className={css.spanText}>exciting journey</span>, where
      each page revealed new horizons, and the characters became inseparable
      friends.
    </p>
  );

  return (
    <CommonModal
      onClose={onClose}
      isOpen={isOpen}
      picture={picture}
      title={title}
      text={text}
    />
  );
}

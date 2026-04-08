import CommonModal from '../CommonModal/CommonModal';
import css from './SuccessModal.module.css';

export default function SuccessModal({ onClose, isOpen }) {
  const picture = 'images/thumb@2x.png';
  const title = 'Good job';
  const text = (
    <p className={css.text}>
      Your book is now in <span className={css.spanText}>the library!</span> The
      joy knows no bounds and now you can start your training
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

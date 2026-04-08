import Modal from '../Modal/Modal';
import css from './AnotherCommonModal.module.css';

export default function AnotherCommonModal({
  book,
  onClose,
  isOpen,
  handleClick,
  buttonText,
  isAlreadyAdded,
}) {
  const isDefaultCover = !book?.imageUrl || book.imageUrl.trim() === '';

  const cover =
    book?.imageUrl && book.imageUrl.trim() !== ''
      ? book.imageUrl
      : '/images/cover@2x.png';

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={css.wrapper}>
        <div className={css.bookInfo}>
          <img
            className={`${css.image} ${isDefaultCover ? css.defaultImage : ''}`}
            src={cover}
            alt={book?.title}
          />
          <div className={css.bookBox}>
            <p className={css.titleText}>{book?.title}</p>
            <p className={css.authorText}>{book?.author}</p>
          </div>
          <p className={css.pageText}>{book?.totalPages ?? ''} pages</p>
          <button
            className={css.button}
            type="button"
            disabled={isAlreadyAdded}
            onClick={handleClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

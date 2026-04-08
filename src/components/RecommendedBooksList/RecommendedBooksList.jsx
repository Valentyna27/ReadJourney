import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deleteBook } from '../../redux/books/operations';
import ModalAddBook from '../ModalAddBook/ModalAddBook';
import StartReadingModal from '../StartReadingModal/StartReadingModal';
import icon from '../../../public/icons/sprite.svg';
import css from './RecommendedBooksList.module.css';

export default function RecommendedBooksList({
  books = [],
  isLibrary = false,
  onAddBook,
  isBookExists,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const dispatch = useDispatch();

  const location = useLocation();

  const isLibraryPath = location.pathname.includes('library');

  const handleDelete = async id => {
    try {
      await dispatch(deleteBook(id)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = book => {
    setSelectedBook(book);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  if (!books || books.length === 0) {
    return <p className={css.noBooksText}>No books found</p>;
  }

  return (
    <>
      <ul className={css.booksList}>
        {books.map((book, index) => {
          {
            /* const cover =
            book.imageUrl && book.imageUrl.trim() !== '' ? (
              book.imageUrl
            ) : (
              <div className={css.defaultCoverBox}>
                <img
                  className={css.defaultCover}
                  src="/images/cover@2x.png"
                  alt="defaultCover"
                />
              </div>
            ); */
          }

          return (
            <li
              key={book._id || book.title + book.author || index}
              className={css.bookItem}
              onClick={() => handleClick(book)}
            >
              {book.imageUrl && book.imageUrl.trim() !== '' ? (
                <img
                  className={css.bookCover}
                  src={book.imageUrl}
                  alt={book.title}
                />
              ) : (
                <div className={css.defaultCoverBox}>
                  <img
                    className={css.defaultCover}
                    src="/images/cover@2x.png"
                    alt="defaultCover"
                  />
                </div>
              )}
              <div className={css.bookInfo}>
                <div className={css.textBox}>
                  <h3 className={css.bookTitle}>{book.title}</h3>
                  <p className={css.bookAuthor}>{book.author}</p>
                </div>
                {isLibrary && (
                  <button
                    className={css.deleteBtn}
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(book._id);
                    }}
                  >
                    <div className={css.iconDeleteBox}>
                      <svg className={css.iconDelete} width={14} height={14}>
                        <use href={`${icon}#delete`}></use>
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {selectedBook && !isLibraryPath && (
        <ModalAddBook
          book={selectedBook}
          isOpen={isOpen}
          onClose={handleClose}
          onAdd={onAddBook}
          isAlreadyAdded={isBookExists(selectedBook)}
        />
      )}

      {selectedBook && isLibraryPath && (
        <StartReadingModal
          book={selectedBook}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
}

import { Formik, Form, Field, useFormikContext } from 'formik';
import { useState, useEffect, useId } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOwnBooks } from '../../redux/books/operations';
import { Link, useNavigate } from 'react-router-dom';
import { getRecommendedBooks } from '../../axios/books';
import { selectToken } from '../../redux/auth/selectors';
import { addBookById } from '../../redux/books/operations';
import RecommendedBooksList from '../../components/RecommendedBooksList/RecommendedBooksList';
import Loader from '../../components/Loader/Loader';
import AllPagesWrapper from '../../components/AllPagesWrapper/AllPagesWrapper';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import icon from '../../../public/icons/sprite.svg';
import css from './RecommendedPage.module.css';

const PersistObserver = () => {
  const { values } = useFormikContext();

  useEffect(() => {
    localStorage.setItem('recommended-filters', JSON.stringify(values));
  }, [values]);

  return null;
};

const FormObserver = () => {
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    if (values.title.trim() === '' && values.author.trim() === '') {
      submitForm();
    }
  }, [values.title, values.author, submitForm]);

  return null;
};

export default function RecommendedPage() {
  const titleId = useId();
  const authorId = useId();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const ownBooks = useSelector(state => state.books.items);
  const [notificationText, setNotificationText] = useState('');

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [booksPerPage, setBooksPerPage] = useState(2);
  const [startBook, setStartBook] = useState(0);

  const savedValues = JSON.parse(localStorage.getItem('recommended-filters'));
  const initialValues = savedValues || { author: '', title: '' };

  useEffect(() => {
    if (!token) return;
    dispatch(fetchOwnBooks());

    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const data = await getRecommendedBooks(token, 1, 10);
        setBooks(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [token, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setBooksPerPage(10);
      else if (window.innerWidth >= 768) setBooksPerPage(8);
      else setBooksPerPage(2);
      setStartBook(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleBooks = Array.isArray(books)
    ? books.slice(startBook, startBook + booksPerPage)
    : [];

  const isPrevDisabled = startBook === 0;
  const isNextDisabled = startBook + booksPerPage >= books.length;

  const handleNextBooks = () => {
    setStartBook(prev =>
      Math.min(prev + booksPerPage, books.length - booksPerPage)
    );
  };

  const handlePrevBooks = () => {
    setStartBook(prev => Math.max(prev - booksPerPage, 0));
  };

  const handleSubmit = async values => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getRecommendedBooks(token, 1, 10, values);
      setBooks(Array.isArray(data.results) ? data.results : []);
      setStartBook(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const isBookExists = bookToCheck => {
    return ownBooks.some(
      b =>
        b.title.trim().toLowerCase() ===
          bookToCheck.title.trim().toLowerCase() &&
        b.author.trim().toLowerCase() ===
          bookToCheck.author.trim().toLowerCase()
    );
  };

  const handleAddBook = async book => {
    if (isBookExists(book)) {
      setNotificationText('This book is already in your library');
      return;
    }
    try {
      await dispatch(addBookById(book._id)).unwrap();
      setNotificationText('Book added to your library');
    } catch (error) {
      setNotificationText('Failed to add book');
    }
  };

  if (!token) return <p className={css.noBooksText}>Unauthorized</p>;
  if (error) return <p className={css.noBooksText}>No books found</p>;

  const filterComponent = (
    <>
      <div className={css.formWrapper}>
        <p className={css.filterText}>Filters:</p>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          <Form className={css.form}>
            <FormObserver />
            <PersistObserver />
            <div className={css.inputsWrapper}>
              <div className={css.fieldWrapper}>
                <div className={css.inputContainer}>
                  <label htmlFor={titleId} className={css.label}>
                    Book title:
                  </label>
                  <Field
                    className={css.input}
                    name="title"
                    id={titleId}
                    placeholder="Enter text"
                  />
                </div>
              </div>
              <div className={css.fieldWrapper}>
                <div className={css.inputContainer}>
                  <label htmlFor={authorId} className={css.label}>
                    The author:
                  </label>
                  <Field
                    className={css.input}
                    name="author"
                    id={authorId}
                    placeholder="Enter text"
                  />
                </div>
              </div>
            </div>
            <button className={css.btn} type="submit">
              To apply
            </button>
          </Form>
        </Formik>
      </div>

      <div className={css.goToLibBox}>
        <p className={css.startText}>Start your workout</p>
        <div className={css.smallBox}>
          <div className={css.circle}>
            <p className={css.circleText}>1</p>
          </div>
          <p className={css.smallBoxText}>
            Create a personal library:{' '}
            <span className={css.spanText}>
              add the books you intend to read to it.
            </span>
          </p>
        </div>
        <div className={css.smallBox}>
          <div className={css.circle}>
            <p className={css.circleText}>2</p>
          </div>
          <p className={css.smallBoxText}>
            Create your first workout:{' '}
            <span className={css.spanText}>
              define a goal, choose a period, start training.
            </span>
          </p>
        </div>
        <div className={css.libraryBox}>
          <Link to="/library" className={css.link}>
            My library
          </Link>
          <button
            className={css.goToLibBtn}
            type="button"
            onClick={() => navigate('/library')}
          >
            <svg className={css.arrowIcon} width={24} height={24}>
              <use href="/icons/sprite.svg#arrow"></use>
            </svg>
          </button>
        </div>
      </div>

      <div className={css.desktopOnlyBox}>
        <img className={css.bookImg} src="/images/books@2x.png" alt="Books" />
        <p className={css.quote}>
          "Books are <span className={css.quoteSpan}>windows </span>to the
          world, and reading is a journey into the unknown."
        </p>
      </div>
    </>
  );

  const booksComponent = (
    <>
      <div className={css.booksBox}>
        <h1 className={css.recommendedTitle}>Recommended</h1>
        <div className={css.btnWrapper}>
          <button
            type="button"
            className={css.button}
            disabled={isPrevDisabled}
            onClick={handlePrevBooks}
          >
            <svg className={css.backIcon} viewBox="0 0 16 16">
              <use href={`${icon}#forward`}></use>
            </svg>
          </button>
          <button
            type="button"
            className={css.button}
            disabled={isNextDisabled}
            onClick={handleNextBooks}
          >
            <svg className={css.forwardIcon} viewBox="0 0 16 16">
              <use href={`${icon}#forward`}></use>
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <RecommendedBooksList
          books={visibleBooks}
          onAddBook={handleAddBook}
          isBookExists={isBookExists}
        />
      )}
    </>
  );

  return (
    <>
      <AllPagesWrapper
        firstComponent={filterComponent}
        secondComponent={booksComponent}
      />
      {notificationText && (
        <ToastNotification
          message={notificationText}
          onClose={() => setNotificationText('')}
        />
      )}
    </>
  );
}

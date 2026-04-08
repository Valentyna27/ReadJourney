import { useState, useEffect, useId, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getRecommendedBooks } from '../../axios/books';
import { selectToken } from '../../redux/auth/selectors';
import { addBook, fetchOwnBooks } from '../../redux/books/operations';
import AllPagesWrapper from '../../components/AllPagesWrapper/AllPagesWrapper';
import RecommendedBooksList from '../../components/RecommendedBooksList/RecommendedBooksList';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import FiltersBox from '../../components/FiltersBox/FiltersBox';
import Loader from '../../components/Loader/Loader';
import styles from '../../pages/RecommendedPage/RecommendedPage.module.css';
import css from './MyLibraryPage.module.css';
import { selectStatusFilter } from '../../redux/filters/slice';

export default function MyLibraryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const ownBooks = useSelector(state => state.books.items || []);
  const isLoading = useSelector(state => state.books.isLoading);
  const statusFilter = useSelector(selectStatusFilter);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(2);

  const titleId = useId();
  const authorId = useId();
  const pageId = useId();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setBooksPerPage(10);
      else if (window.innerWidth >= 768) setBooksPerPage(8);
      else setBooksPerPage(2);
      setCurrentPage(0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchOwnBooks());
  }, [dispatch]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getRecommendedBooks(token, 1, 12);
        const booksArray = Array.isArray(data)
          ? data
          : data.items || data.results || [];
        setRecommendedBooks(booksArray.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchBooks();
  }, [token]);

  const filteredBooks = useMemo(() => {
    return ownBooks.filter(book => {
      if (!statusFilter || statusFilter === 'all') return true;

      const normalizedBookStatus = book.status
        .toLowerCase()
        .replace(/[\s-]/g, '');
      const normalizedFilter = statusFilter.toLowerCase().replace(/[\s-]/g, '');

      return normalizedBookStatus === normalizedFilter;
    });
  }, [ownBooks, statusFilter]);

  const visibleBooks = useMemo(() => {
    const startIndex = currentPage * booksPerPage;
    return filteredBooks.slice(startIndex, startIndex + booksPerPage);
  }, [filteredBooks, currentPage, booksPerPage]);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredBooks.length / booksPerPage) - 1
    );
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredBooks.length, booksPerPage, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [statusFilter]);

  const isPrevDisabled = currentPage === 0;
  const isNextDisabled =
    (currentPage + 1) * booksPerPage >= filteredBooks.length;

  const handleNextBooks = () => {
    if (!isNextDisabled) setCurrentPage(prev => prev + 1);
  };
  const handlePrevBooks = () => {
    if (!isPrevDisabled) setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = async (values, actions) => {
    try {
      const payload = {
        title: values.title,
        author: values.author,
        totalPages: Number(values.page),
      };
      await dispatch(addBook(payload)).unwrap();
      actions.resetForm();
      dispatch(fetchOwnBooks());
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const firstBlock = (
    <>
      <div className={css.addBookBlock}>
        <p className={styles.filterText}>Filters:</p>
        <Formik
          initialValues={{ title: '', author: '', page: '' }}
          validationSchema={Yup.object({
            title: Yup.string().required('Required'),
            author: Yup.string().required('Required'),
            page: Yup.number().positive().required('Required'),
          })}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <div className={styles.inputsWrapper}>
              <div className={styles.fieldWrapper}>
                <div className={styles.inputContainer}>
                  <label htmlFor={titleId} className={styles.label}>
                    Book title:
                  </label>
                  <Field
                    className={styles.input}
                    name="title"
                    id={titleId}
                    placeholder="Enter title name"
                  />
                </div>
                <ErrorMessage
                  className={css.errorMessage}
                  name="title"
                  component="div"
                />
              </div>

              <div className={styles.fieldWrapper}>
                <div className={styles.inputContainer}>
                  <label htmlFor={authorId} className={styles.label}>
                    Author:
                  </label>
                  <Field
                    className={styles.input}
                    name="author"
                    id={authorId}
                    placeholder="Enter author name"
                  />
                </div>
                <ErrorMessage
                  className={css.errorMessage}
                  name="author"
                  component="div"
                />
              </div>

              <div className={styles.fieldWrapper}>
                <div className={styles.inputContainer}>
                  <label htmlFor={pageId} className={styles.label}>
                    Number of pages:
                  </label>
                  <Field
                    className={styles.input}
                    name="page"
                    id={pageId}
                    placeholder="0"
                  />
                </div>
                <ErrorMessage
                  className={css.errorMessage}
                  name="page"
                  component="div"
                />
              </div>
            </div>

            <button className={styles.btn} type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add book'}
            </button>
          </Form>
        </Formik>
      </div>

      <div className={css.recBox}>
        <h2 className={css.recTitle}>Recommended books</h2>
        <ul className={css.recBooksList}>
          {recommendedBooks.map(book => (
            <li key={book._id || book.id} className={css.recBookItem}>
              <img
                src={book.imageUrl || '/images/cover@2x.png'}
                alt={book.title}
                className={css.recBookCover}
              />
              <div className={css.recTextBox}>
                <h3 className={css.recBookTitle}>{book.title}</h3>
                <p className={css.recBookAuthor}>{book.author}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={css.linkHomeBox}>
          <Link className={css.linkHome} to="/recommended">
            Home
          </Link>
          <button
            className={css.homeBtn}
            type="button"
            onClick={() => navigate('/recommended')}
          >
            <svg className={css.arrowIcon} width={20} height={20}>
              <use href="/icons/sprite.svg#arrow"></use>
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  const secondBlock = (
    <div className={css.booksWrapper}>
      <div className={css.block}>
        <h1 className={css.title}>My Library</h1>
        <div className={css.controlsBox}>
          <FiltersBox />
          {filteredBooks.length > booksPerPage && (
            <div className={css.pagination}>
              <button
                className={css.pagBtn}
                onClick={handlePrevBooks}
                disabled={isPrevDisabled}
              >
                <svg className={css.arrowLeft} width={20} height={20}>
                  <use href="/icons/sprite.svg#arrow"></use>
                </svg>
              </button>
              <button
                className={css.pagBtn}
                onClick={handleNextBooks}
                disabled={isNextDisabled}
              >
                <svg className={css.arrowRight} width={20} height={20}>
                  <use href="/icons/sprite.svg#arrow"></use>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      ) : ownBooks.length === 0 ? (
        <div className={css.secondBox}>
          <div className={css.imgWrapper}>
            <img className={css.image} src="/images/books@2x.png" alt="books" />
          </div>
          <p className={css.text}>
            To start training, add{' '}
            <span className={css.spanText}>some of your books</span> or from the
            recommended ones
          </p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <RecommendedBooksList
          books={visibleBooks}
          isLibrary
          onDelete={() => dispatch(fetchOwnBooks())}
        />
      ) : (
        <div className={css.noBooksBox}>
          <p className={css.noBooksText}>
            No books found for status: {statusFilter}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <AllPagesWrapper
        firstComponent={firstBlock}
        secondComponent={secondBlock}
      />
      {isSuccessModalOpen && (
        <SuccessModal
          onClose={() => setIsSuccessModalOpen(false)}
          isOpen={isSuccessModalOpen}
        />
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import {
  fetchBookById,
  startReading,
  stopReading,
} from '../../redux/books/operations';

import AllPagesWrapper from '../../components/AllPagesWrapper/AllPagesWrapper';
import Diary from '../../components/Diary/Diary';
import Statistics from '../../components/Statistics/Statistics';
import FinishBookModal from '../../components/FinishBookModal/FinishBookModal';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import icon from '../../../public/icons/sprite.svg';
import css from './ReadingPage.module.css';

export default function ReadingPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [notification, setNotification] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeReadingTab') || 'diary';
  });

  const bookId = location.state?.book?._id || location.state?.book?.id;

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    localStorage.setItem('activeReadingTab', activeTab);
  }, [activeTab]);

  const bookFromStore = useSelector(state =>
    state.books.items.find(b => b._id === bookId || b.id === bookId)
  );

  const currentBook = bookFromStore || location.state?.book;

  const totalPages = Number(currentBook?.totalPages || 0);
  const events = currentBook?.progress || [];
  const isReading = currentBook?.isReading;
  const lastReadPage =
    events.length > 0 ? Math.max(...events.map(e => e.finishPage || 0)) : 0;

  const readingProgress =
    totalPages > 0
      ? lastReadPage >= totalPages
        ? 100
        : (lastReadPage / totalPages) * 100
      : 0;

  useEffect(() => {
    if (totalPages > 0 && lastReadPage >= totalPages) {
      setIsModalOpen(true);
    }
  }, [lastReadPage, totalPages]);

  if (!currentBook) return <p className={css.loadingText}>No book selected</p>;

  const ReadingSchema = Yup.object({
    page: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .integer('Must be integer')
      .max(totalPages, `Max page is ${totalPages}`)
      .moreThan(lastReadPage, `You've already read up to page ${lastReadPage}`)
      .required('Required'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const bId = currentBook._id || currentBook.id;
      const page = Number(values.page);

      if (!isReading) {
        await dispatch(startReading({ bookId: bId, page })).unwrap();
        setNotification('Reading started 📚');
      } else {
        await dispatch(stopReading({ bookId: bId, page })).unwrap();
        setNotification('Reading stopped!');
        if (page >= totalPages) setIsModalOpen(true);
      }
      resetForm();
    } catch (err) {
      setNotification(`${err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AllPagesWrapper
        firstComponent={
          <div className={css.readingBlock}>
            <div className={css.formBox}>
              <p className={css.starPageText}>
                {isReading ? 'Stop page:' : 'Start page:'}
              </p>

              <Formik
                key={`${isReading}-${lastReadPage}`}
                initialValues={{ page: '' }}
                validationSchema={ReadingSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className={css.form}>
                    <div className={css.inputWrapper}>
                      <div className={css.inputContainer}>
                        <label className={css.label}>Page number:</label>
                        <Field
                          className={`${css.input} ${
                            errors.page && touched.page ? css.inputError : ''
                          }`}
                          name="page"
                          placeholder={lastReadPage + 1}
                        />
                      </div>
                      <ErrorMessage
                        className={css.errorMessage}
                        name="page"
                        component="div"
                      />
                    </div>

                    <button
                      type="submit"
                      className={css.button}
                      disabled={
                        isSubmitting ||
                        !!errors.page ||
                        lastReadPage >= totalPages
                      }
                    >
                      {isReading ? 'To stop' : 'To start'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            <div className={css.progressSection}>
              {events.length === 0 ? (
                <div className={css.progressBox}>
                  <div>
                    <h3 className={css.progressTitle}>Progress</h3>
                    <p className={css.progressText}>
                      Here you will see when and how much you read. To record,
                      click on the red button above.
                    </p>
                  </div>
                  <div className={css.imageBox}>
                    <img
                      className={css.imageStar}
                      src="/images/star@2x.png"
                      alt="star"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className={css.diaryStatBox}>
                    <h3 className={css.diaryStatTitle}>
                      {activeTab === 'diary' ? 'Diary' : 'Statistics'}
                    </h3>
                    <div className={css.diaryStatIconsBox}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('diary')}
                        className={activeTab === 'diary' ? css.active : ''}
                      >
                        <svg width="20" height="20">
                          <use href={`${icon}#diary`}></use>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('statistics')}
                        className={activeTab === 'statistics' ? css.active : ''}
                      >
                        <svg width="20" height="20">
                          <use href={`${icon}#statistics`}></use>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={css.detailsContent}>
                    {activeTab === 'diary' ? (
                      <Diary
                        events={events}
                        totalPages={totalPages}
                        bookId={currentBook._id || currentBook.id}
                      />
                    ) : (
                      <Statistics
                        events={events}
                        totalPages={totalPages}
                        readingProgress={readingProgress}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        }
        secondComponent={
          <div className={css.detailsBlock}>
            <h2 className={css.myReadingTitle}>My Reading</h2>
            <div className={css.bookInfo}>
              <img
                src={currentBook.imageUrl || '/images/cover@2x.png'}
                alt="cover"
                className={css.bookCover}
              />
              <p className={css.bookTitle}>{currentBook.title}</p>
              <p className={css.bookAuthor}>{currentBook.author}</p>

              <div className={isReading ? css.statusStop : css.statusStart}>
                <button className={css.startBtn} type="button">
                  {isReading ? (
                    <div className={css.stopIcon}></div>
                  ) : (
                    <div className={css.startIcon}></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        }
      />

      <FinishBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {notification && (
        <ToastNotification
          message={notification}
          onClose={() => setNotification('')}
        />
      )}
    </div>
  );
}

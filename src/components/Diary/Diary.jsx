import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteReadingEvent } from '../../redux/books/operations';
import icon from '../../../public/icons/sprite.svg';
import css from './Diary.module.css';

export default function Diary({ events = [], totalPages, bookId }) {
  const dispatch = useDispatch();

  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.finishReading || b.startReading) -
      new Date(a.finishReading || a.startReading)
  );

  const groupedByDay = sortedEvents.reduce((acc, event) => {
    const dateObj = new Date(
      event.finishReading || event.startReading || event.date
    );
    const formattedDate = dateObj.toLocaleDateString('uk-UA');
    const isToday = new Date().toLocaleDateString('uk-UA') === formattedDate;

    const sPages =
      event.finishPage && event.startPage !== undefined
        ? Number(event.finishPage) - Number(event.startPage)
        : 0;

    let dayEntry = acc.find(item => item.date === formattedDate);
    if (dayEntry) {
      dayEntry.dayTotal += sPages;
      dayEntry.sessions.push({ ...event, sPages });
    } else {
      acc.push({
        date: formattedDate,
        isToday,
        dayTotal: sPages,
        sessions: [{ ...event, sPages }],
      });
    }
    return acc;
  }, []);

  const handleDelete = async readingId => {
    try {
      await dispatch(deleteReadingEvent({ bookId, readingId })).unwrap();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className={css.diaryBox}>
      <div className={css.scrollContainer}>
        <ul className={css.diaryList}>
          {groupedByDay.map(day => (
            <li key={day.date} className={css.diaryItem}>
              <div className={css.dateBox}>
                <div className={css.leftPart}>
                  <div
                    className={`${
                      day.isToday ? css.todaySquare : css.pastSquare
                    }`}
                  >
                    <div className={css.innerSquare}></div>
                  </div>
                  <p
                    className={`${css.date} ${
                      day.isToday ? css.todayDate : css.pastDate
                    }`}
                  >
                    {day.date}
                  </p>
                </div>
                <p className={css.pagesCount}>{day.dayTotal} pages</p>
              </div>

              {day.sessions.map(event => {
                const percent =
                  totalPages > 0
                    ? ((event.sPages / totalPages) * 100).toFixed(1)
                    : '0.0';

                let durationMinutes = 0;
                if (event.startReading && event.finishReading) {
                  const start = new Date(event.startReading).getTime();
                  const finish = new Date(event.finishReading).getTime();
                  durationMinutes = Math.round((finish - start) / 1000 / 60);
                }

                return (
                  <div
                    key={event._id || event.startReading}
                    className={css.statBox}
                  >
                    <div className={css.statInfo}>
                      <p className={css.percentText}>{percent}%</p>
                      <p className={css.timeText}>
                        {durationMinutes > 0 ? durationMinutes : 0} minutes
                      </p>
                    </div>
                    <div className={css.rightPart}>
                      <div className={css.chartWrapper}>
                        <div className={css.speedChartIcon}>
                          <svg
                            viewBox="0 0 70 30"
                            preserveAspectRatio="none"
                            fill="none"
                          >
                            <polyline
                              className={css.chartGrow}
                              points="0 30, 0 15, 70 5, 70 30"
                              fill="#2D4F39"
                            />
                            <polyline
                              className={css.chartLine}
                              points="0 15, 70 5"
                              stroke="#30B94D"
                              strokeWidth="4"
                            />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className={css.deleteBtn}
                          onClick={() => handleDelete(event._id)}
                        >
                          <svg
                            className={css.deleteIcon}
                            width="14"
                            height="14"
                          >
                            <use href={`${icon}#delete`}></use>
                          </svg>
                        </button>
                      </div>

                      <p className={css.speedText}>
                        {event.speed || 0} pages per hour
                      </p>
                    </div>
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

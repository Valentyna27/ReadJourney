import css from './Statistics.module.css';

export default function Statistics({ events = [], totalPages = 0 }) {
  const pages = events.map(e => Number(e.finishPage)).filter(p => !isNaN(p));
  const currentMaxPage = pages.length > 0 ? Math.max(...pages) : 0;

  const rawPercent = totalPages > 0 ? (currentMaxPage / totalPages) * 100 : 0;
  const percent = Math.min(rawPercent, 100);
  const displayPercent = rawPercent.toFixed(2);

  return (
    <div className={css.wrapper}>
      <p className={css.text}>
        Each page, each chapter is a new round of knowledge, a new step towards
        understanding. By rewriting statistics, we create our own reading
        history.
      </p>

      <div className={css.circleBox}>
        <div className={css.circle} style={{ '--progress': percent }}>
          <svg className={css.svgCircle} viewBox="0 0 120 120">
            <circle className={css.circleBg} cx="60" cy="60" r="54" />
            <circle className={css.circleProgress} cx="60" cy="60" r="54" />
          </svg>
          <div className={css.inner}>
            <span className={css.centerText}>100%</span>
          </div>
        </div>

        <div className={css.wrapperForPagesStat}>
          <div className={css.greenMark}></div>
          <div className={css.statisticsWrapper}>
            <p className={css.percentOfPages}>
              {percent >= 100 ? '100.00' : displayPercent}%
            </p>
            <p className={css.numberOfPages}>{currentMaxPage} pages read</p>
          </div>
        </div>
      </div>
    </div>
  );
}

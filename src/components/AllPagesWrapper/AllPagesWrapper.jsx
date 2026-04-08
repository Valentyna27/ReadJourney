import css from './AllPagesWrapper.module.css';

export default function AllPagesWrapper({ firstComponent, secondComponent }) {
  return (
    <div className="container">
      <div className={css.mainWrapper}>
        <div className={css.filterWrapper}>{firstComponent}</div>
        <div className={css.booksWrapper}>{secondComponent}</div>
      </div>
    </div>
  );
}

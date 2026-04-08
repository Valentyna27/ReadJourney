import { useState,  useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusFilter, selectStatusFilter } from '../../redux/filters/slice';
import css from './FiltersBox.module.css';
import icon from '../../../public/icons/sprite.svg';

const options = [
  { label: 'All books', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'In progress', value: 'in progress' },
  { label: 'Done', value: 'done' },
];

export default function FiltersBox() {
  const dispatch = useDispatch();
  const statusFilter = useSelector(selectStatusFilter);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleSelect = value => {
    dispatch(setStatusFilter(value));
    setOpen(false);
  };

  const currentLabel =
    options.find(o => o.value === statusFilter)?.label || 'All books';

  return (
    <div className={css.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${css.filterBtn} ${open ? css.opened : ''}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <p className={css.selectedFilter}>{currentLabel}</p>
        <svg className={css.arrowIcon} width={16} height={16}>
          <use href={`${icon}#btnArrow`}></use>
        </svg>
      </button>

      {open && (
        <div className={css.dropdown}>
          {options.map(option => (
            <div
              key={option.value}
              className={`${css.item} ${
                statusFilter === option.value ? css.active : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

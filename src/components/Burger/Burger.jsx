import Navigation from '../Navigation/Navigation';
import icon from '../../../public/icons/sprite.svg';
import css from './Burger.module.css';

export default function Burger({ onClose, logOut }) {
  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <svg className={css.closeIcon} width="28" height="28">
            <use href={`${icon}#closeBtn`} />
          </svg>
        </button>
        <div className={css.burgerNavWrapper}>
          <Navigation className={css.burgerNav} />
        </div>
        <button
          className={css.logOutBtn}
          onClick={() => {
            logOut();
            onClose();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

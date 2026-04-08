import { Link } from 'react-router-dom';
import icon from '../../../public/icons/sprite.svg';
import css from './Logo.module.css';

export default function Logo({ textFor = 'desktop' }) {
  const textClass =
    textFor === 'desktop' ? css.logoTextDesktop : css.logoTextTablet;

  return (
    <div className={css.logoWrapper}>
      <Link to="/recommended" className={css.logoLink}>
        <svg className={css.logoIcon} width={42} height={18}>
          <use href={`${icon}#logo`} />
        </svg>
        <span className={textClass}>Read Journey</span>
      </Link>
    </div>
  );
}

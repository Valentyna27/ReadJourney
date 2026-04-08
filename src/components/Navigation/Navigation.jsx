import { NavLink } from 'react-router-dom';
import css from './Navigation.module.css';

export default function Navigation({ className }) {
  return (
    <nav className={`${css.nav} ${className || ''}`}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.active}` : css.link
        }
        to="/recommended"
      >
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.active}` : css.link
        }
        to="/library"
      >
        My library
      </NavLink>
    </nav>
  );
}

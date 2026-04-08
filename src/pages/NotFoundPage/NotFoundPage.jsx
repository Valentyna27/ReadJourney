import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import css from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.text}>Page not found</p>
      {isLoggedIn && (
        <NavLink to="/recommended" className={css.homeBtn}>
          Go Home
        </NavLink>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../redux/auth/selectors';
import { logout } from '../../redux/auth/operations';
import { clearAuthHeader } from '../../axios/api';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import Burger from '../Burger/Burger';
import ToastNotification from '../ToastNotification/ToastNotification';
import icon from '../../../public/icons/sprite.svg';
import css from './Header.module.css';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);


  const name = user?.name || '';
  const iconLetter = name ? name[0].toUpperCase() : '?';
  const fullUserName = name ? name[0].toUpperCase() + name.slice(1) : '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleModal = () => setIsModalOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      clearAuthHeader();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message || 'Logout failed');
    }
  };

  return (
    <div className="container">
      <header className={css.header}>
        {errorMessage && (
          <ToastNotification
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}
        <div className={css.box}>
          <Logo />
          <Navigation />
          <div className={css.wrapper}>
            {name && (
              <div className={css.fullNameBox}>
                <div className={css.userBox}>
                  <p className={css.userName}>{iconLetter}</p>
                </div>
                <p className={css.fullName}>{fullUserName}</p>
              </div>
            )}
            <button
              type="button"
              className={css.logOutBtn}
              onClick={handleLogout}
            >
              Log Out
            </button>
            <button
              className={css.burgerBtn}
              type="button"
              onClick={toggleModal}
            >
              <svg className={css.burgerIcon} width={28} height={28}>
                <use href={`${icon}#burger`}></use>
              </svg>
            </button>
          </div>
        </div>
        {isModalOpen && <Burger onClose={toggleModal} logOut={handleLogout} />}
      </header>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import Header from '../Header/Header';

export default function Layout() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <div>
      {isLoggedIn && <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

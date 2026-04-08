import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';

export default function PrivateRoute({
  component: Component,
  redirectTo = '/login',
}) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  if (isRefreshing) {
    return <Loader />;
  }
  return isLoggedIn ? Component : <Navigate to={redirectTo} />;
}

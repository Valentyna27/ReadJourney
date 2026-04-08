import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/auth/operations';
import { selectIsRefreshing } from './redux/auth/selectors';

import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import RestrictedRoute from './components/RestrictedRoute/RestrictedRoute';
import Loader from './components/Loader/Loader';

const LogInPage = lazy(() => import('./pages/LogInPage/LogInPage'));
const RegistrationPage = lazy(() =>
  import('./pages/RegistrationPage/RegistrationPage')
);
const RecommendedPage = lazy(() =>
  import('./pages/RecommendedPage/RecommendedPage')
);
const MyLibraryPage = lazy(() => import('./pages/MyLibraryPage/MyLibraryPage'));
const ReadingPage = lazy(() => import('./pages/ReadingPage/ReadingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isRefreshing) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <RestrictedRoute
              redirectTo="/recommended"
              component={<LogInPage />}
            />
          }
        />
        <Route
          path="/registration"
          element={
            <RestrictedRoute
              redirectTo="/recommended"
              component={<RegistrationPage />}
            />
          }
        />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/recommended" />} />
          <Route
            path="recommended"
            element={
              <PrivateRoute
                redirectTo="/login"
                component={<RecommendedPage />}
              />
            }
          />
          <Route
            path="library"
            element={
              <PrivateRoute redirectTo="/login" component={<MyLibraryPage />} />
            }
          />
          <Route
            path="reading"
            element={
              <PrivateRoute redirectTo="/login" component={<ReadingPage />} />
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;

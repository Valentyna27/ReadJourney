import WrapperForAuthUser from '../../components/WrapperForAuthUser/WrapperForAuthUser';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import { useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../redux/auth/operations';
import * as Yup from 'yup';

export default function LogInPage() {
  const goToRegistration = (
    <Link to="/registration">Don't have an account?</Link>
  );

  const dispatch = useDispatch();
  const emailId = useId();
  const passwordId = useId();
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(emailPattern, 'Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(7, 'Password must be at least 7 characters')
      .required('Required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(login(values)).unwrap();

      setNotification('Authorization successful');
      resetForm();
      navigate('/recommended');
    } catch (error) {
      setNotification(
        error?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <>
      {notification && (
        <ToastNotification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <WrapperForAuthUser
        buttonText="Log In"
        link={goToRegistration}
        gap="logIn"
        emailId={emailId}
        passwordId={passwordId}
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

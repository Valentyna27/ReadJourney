import WrapperForAuthUser from '../../components/WrapperForAuthUser/WrapperForAuthUser';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import { useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Field, ErrorMessage } from 'formik';
import { register } from '../../redux/auth/operations';
import * as Yup from 'yup';
import css from './RegistrationPage.module.css';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const goToLogIn = <Link to="/login">Already have an account?</Link>;

  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  const dispatch = useDispatch();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const [notification, setNotification] = useState(null);

  const nameInput = (
    <div className={css.fieldWrapper}>
      <div className={css.inputContainer}>
        <label htmlFor={nameId} className={css.label}>
          Name:
        </label>
        <Field
          className={css.input}
          type="text"
          name="name"
          id={nameId}
          placeholder="Your name"
        />
      </div>
      <ErrorMessage className={css.errorMessage} name="name" component="div" />
    </div>
  );

  const initialsValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3).required('Required'),
    email: Yup.string()
      .matches(emailPattern, 'Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(7, 'Password must be at least 7 characters')
      .required('Required'),
  });

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(register(values)).unwrap();

      setNotification('Registration successful');
      actions.resetForm();
      navigate('/recommended', { replace: true });
    } catch (error) {
      setNotification(
        typeof error === 'string'
          ? error
          : error?.message || 'Registration failed'
      );
    } finally {
      actions.setSubmitting(false);
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
        children={nameInput}
        buttonText="Registration"
        link={goToLogIn}
        gap="registration"
        nameId={nameId}
        emailId={emailId}
        passwordId={passwordId}
        initialValues={initialsValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

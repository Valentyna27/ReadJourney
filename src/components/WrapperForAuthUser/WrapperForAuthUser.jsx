import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Logo from '../Logo/Logo';
import icon from '../../../public/icons/sprite.svg';
import css from './WrapperForAuthUser.module.css';

export default function WrapperForAuthUser({
  children,
  buttonText,
  link,
  gap,
  emailId,
  passwordId,
  initialValues,
  validationSchema,
  handleSubmit,
  backendError = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <div className={css.mainWrapper}>
        <div className={`${css.subWrapper} ${css.firstWrapper}`}>
          <Logo textFor="tablet" />

          <h1 className={css.title}>
            Expand your mind, reading{' '}
            <span className={css.spanTitle}>a book</span>
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, submitCount }) => {
              const showPasswordError =
                (touched.password || submitCount > 0) &&
                Boolean(errors.password);
              const showPasswordSuccess = touched.password && !errors.password;

              return (
                <Form
                  className={`${css.form} ${
                    gap === 'registration' ? css.gapRegistration : css.gapLogIn
                  }`}
                >
                  <div className={css.inputsWrapper}>
                    {children}

                    <div className={css.fieldWrapper}>
                      <div className={css.inputContainer}>
                        <label htmlFor={emailId} className={css.label}>
                          Mail:
                        </label>
                        <Field
                          className={css.input}
                          type="email"
                          name="email"
                          id={emailId}
                          placeholder="Your@email.com"
                        />
                      </div>
                      <ErrorMessage
                        className={css.errorMessage}
                        name="email"
                        component="div"
                      />
                    </div>

                    <div className={css.fieldWrapper}>
                      <div
                        className={`${css.inputContainer} ${
                          showPasswordError
                            ? css.error
                            : showPasswordSuccess
                            ? css.success
                            : ''
                        }`}
                      >
                        <label htmlFor={passwordId} className={css.label}>
                          Password:
                        </label>

                        <Field
                          className={css.input}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id={passwordId}
                          placeholder="Your password"
                        />

                        {showPasswordError && (
                          <svg className={css.errorIcon}>
                            <use href={`${icon}#error`} />
                          </svg>
                        )}

                        {showPasswordSuccess && (
                          <svg className={css.successIcon}>
                            <use href={`${icon}#success`} />
                          </svg>
                        )}

                        {!showPasswordError && !showPasswordSuccess && (
                          <button
                            type="button"
                            className={css.eyeButton}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-pressed={showPassword}
                          >
                            <svg className={css.eyeIcon} width="20" height="20">
                              <use
                                href={`/icons/sprite.svg#${
                                  showPassword ? 'eye' : 'eye-off'
                                }`}
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {showPasswordError && (
                        <div className={css.errorMessage}>
                          Enter a valid password. Minimum 7 characters.
                        </div>
                      )}

                      {showPasswordSuccess && (
                        <div className={css.successMessage}>
                          Password is secure
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={css.btnTextWrapper}>
                    <button
                      type="submit"
                      className={`${css.button} ${
                        backendError ? css.error : ''
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : buttonText}
                    </button>
                    <p className={css.linkText}>{link}</p>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div className={`${css.subWrapper} ${css.secondWrapper}`}>
          <picture>
            <source
              media="(max-width:768px)"
              srcSet="/images/mobile@1x.png 1x, /images/mobile@2x.png 2x"
            />
            <source
              media="(min-width:1440px)"
              srcSet="/images/desktop@1x.png 1x, /images/desktop@2x.png 2x"
            />
            <img
              src="/images/desktop@1x.png"
              alt="iphone"
              width="405"
              height="656"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}

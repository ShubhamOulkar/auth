/// <reference types="vite/client" />

const loginEndpoint: string = import.meta.env.VITE_LOGIN_ENDPOINT;
const csrfCookieName: string = import.meta.env.VITE_CSRF_COOKIE_NAME;
const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT;
const localStorageName = import.meta.env.VITE_LOCALSTORAGE_NAME;
const logoutEndpoint = import.meta.env.VITE_LOGOUT_ENDPOINT;
const deleteEndpoint = import.meta.env.VITE_DELETE_ENDPOINT;
const googleEndpoint = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;
const postBodySecretKey: string = import.meta.env.VITE_POST_BODY_SECRET;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const authenticationKey = import.meta.env.VITE_AUTH_KEY;
const resetPasswordEndpoint = import.meta.env.VITE_RESET_PASSWORD_ENDPOINT;
const verifyEmailEndpoint = import.meta.env.VITE_VERIFY_EMAIL_ENDPOINT;
const verifyOtpEndpoint = import.meta.env.VITE_VERIFY_OTP_ENDPOINT;
const postBodyEncSubject = import.meta.env.VITE_SUBJECT;
const postBodyEncExpTime = import.meta.env.VITE_EXP_TIME;
const postBodyEncIssure = import.meta.env.VITE_ISSURE;
const postBodyEncAudience = import.meta.env.VITE_AUDIENCE;

export {
  authenticationKey,
  localStorageName,
  googleClientId,
  loginEndpoint,
  logoutEndpoint,
  deleteEndpoint,
  signupEndpoint,
  googleEndpoint,
  resetPasswordEndpoint,
  verifyEmailEndpoint,
  verifyOtpEndpoint,
  csrfCookieName,
  postBodySecretKey,
  postBodyEncAudience,
  postBodyEncExpTime,
  postBodyEncIssure,
  postBodyEncSubject,
};

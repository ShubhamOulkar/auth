/// <reference types="vite/client" />

const loginEndpoint: string = import.meta.env.VITE_LOGIN_ENDPOINT;
const csrfCookieName: string = import.meta.env.VITE_CSRF_COOKIE_NAME;

const signupEndpoint = import.meta.env.VITE_SIGNUP_ENDPOINT;
const localStorageName = import.meta.env.VITE_LOCALSTORAGE_NAME;
const logoutEndpoint = import.meta.env.VITE_LOGOUT_ENDPOINT;

const googleEndpoint = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;

const POST_BODY_SECRET: string = import.meta.env.VITE_POST_BODY_SECRET;

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

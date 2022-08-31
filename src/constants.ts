export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const BCRYPT_SALT = process.env.REACT_APP_BCRYPT_SALT;

export const BASE_URL = process.env.REACT_APP_PR_API_HOST;
export const LOGIN_URL = BASE_URL + '/api/auth/login';
export const PERSONS_URL = BASE_URL + '/api/persons';
export const IMAGES_URL = BASE_URL + '/api/images';
export const COMMUNITIES_URL = BASE_URL + '/api/communities';

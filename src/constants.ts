export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const BCRYPT_SALT = process.env.REACT_APP_BCRYPT_SALT;

export const API_BASE_URL = process.env.REACT_APP_PR_API_HOST ?? '';

export const LOGIN_URL = API_BASE_URL + '/auth/login';
export const PERSONS_URL = API_BASE_URL + '/persons';
export const IMAGE_URL = API_BASE_URL + '/image';
export const COMMUNITIES_URL = API_BASE_URL + '/communities';
export const IMAGE_UPLOAD_URL = API_BASE_URL + '/imageupload';

export const IMAGES_URL = API_BASE_URL + '/images';
export const PERSON_THUMBNAIL_URL = IMAGES_URL + '/persons/thumbs/thumbnail.';
export const PERSON_IMAGES_MEDIUM_URL = IMAGES_URL + '/persons/medium/';
export const PERSON_IMAGE_URL = IMAGES_URL + '/persons/';
export const COMMUNITY_THUMBNAIL_URL = IMAGES_URL + '/communities/thumbs/thumbnail.';
export const COMMUNITY_IMAGES_MEDIUM_URL = IMAGES_URL + '/communities/medium/';
export const COMMUNITY_IMAGE_URL = IMAGES_URL + '/communities/';

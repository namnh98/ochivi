import { createRequestTypes } from './utils';

export const LOGIN = createRequestTypes('LOGIN');
export const REGISTER = createRequestTypes('REGISTER');
export const GET_LOCATION = createRequestTypes('GET_LOCATION');
export const LOGOUT = 'LOGOUT';

export const login = params => ({
  type: LOGIN.REQUEST,
  params
});
export const logout = () => ({ type: LOGOUT });
export const register = params => ({
  type: REGISTER.REQUEST,
  params
});
export const getLocations = () => ({ type: GET_LOCATION.REQUEST });

import { LOGIN, REGISTER, GET_LOCATION, LOGOUT } from 'actions/auth';

const initialState = {
  token: '',
  user: {},
  locations: [],
  isLogged: false,
  currentPage: 0,
  totalPages: 0,
  isLogging: false,
  isRegistering: false,
  isFetchingLocation: false,
  registerSuccess: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN.REQUEST:
      return {
        ...state,
        isLogging: true,
        isLogged: false
      };
    case LOGIN.SUCCESS:
      return {
        ...state,
        isLogging: false,
        isLogged: true,
        ...action.result
      };
    case LOGIN.FAIL:
      return {
        ...state,
        isLogging: false,
        isLogged: false
      };

    case REGISTER.REQUEST:
      return {
        ...state,
        isRegistering: true,
        isLogged: false
      };
    case REGISTER.SUCCESS:
      return {
        ...state,
        isRegistering: false,
        isLogged: true,
        ...action.result
      };
    case REGISTER.FAIL:
      return {
        ...state,
        isRegistering: false,
        isLogged: false
      };

    case GET_LOCATION.REQUEST:
      return {
        ...state,
        isFetchingLocation: true
      };
    case GET_LOCATION.SUCCESS:
      return {
        ...state,
        isFetchingLocation: false,
        locations: action.result.locations
      };
    case GET_LOCATION.FAIL:
      return {
        ...state,
        isFetchingLocation: false
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

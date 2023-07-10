import { takeEvery, put } from 'redux-saga/effects';
import { LOGIN, REGISTER, GET_LOCATION } from 'actions/auth';
import API from 'configs/API';
import { axiosGet, axiosPost } from './utils';
import queryString from 'query-string';

function* login(obj) {
  const { params = {} } = obj;
  const result = yield axiosPost(API.AUTH.LOGIN, params);
  if (result.success) {
    const { data = {} } = result;

    const userInfo = yield axiosGet(
      API.AUTH.INFO +
        '?' +
        queryString.stringify({
          token: data.token
        })
    );

    if (userInfo.success) {
      yield put({
        type: LOGIN.SUCCESS,
        result: {
          ...data,
          user: userInfo.data.result
        }
      });
    } else {
      yield put({
        type: LOGIN.FAIL,
        result
      });
    }
  } else {
    yield put({
      type: LOGIN.FAIL,
      result
    });
  }
}

function* register(obj) {
  const { params = {} } = obj;
  const result = yield axiosPost(API.AUTH.REGISTER, params);
  if (result.success) {
    const { data = {} } = result;

    const userInfo = yield axiosGet(
      API.AUTH.INFO +
        '?' +
        queryString.stringify({
          token: data.token
        })
    );

    if (userInfo.success) {
      yield put({
        type: REGISTER.SUCCESS,
        result: {
          ...data,
          user: userInfo.data.result
        }
      });
    } else {
      yield put({
        type: REGISTER.FAIL,
        result
      });
    }
  } else {
    yield put({
      type: REGISTER.FAIL,
      result
    });
  }
}

function* getLocations() {
  const result = yield axiosGet(API.AUTH.LOCATION);
  if (result.success) {
    yield put({
      type: GET_LOCATION.SUCCESS,
      result: result.data
    });
  } else {
    yield put({
      type: GET_LOCATION.FAIL,
      result
    });
  }
}

export default function*() {
  yield takeEvery(LOGIN.REQUEST, login);
  yield takeEvery(REGISTER.REQUEST, register);
  yield takeEvery(GET_LOCATION.REQUEST, getLocations);
}

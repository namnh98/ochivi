import { all, fork } from 'redux-saga/effects';

import watchAuth from './auth';

export default function* sagas() {
  yield all([fork(watchAuth)]);
}

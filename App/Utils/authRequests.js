import axios from 'axios';
const { CancelToken } = axios;

const sendGet = (url, params, _token) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    if (_token) {
      axios({
        method: 'get',
        url,
        params,
        headers: {
          Authorization: `Bearer ${_token}`
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } else reject({ internal_error: 'Thiếu access token!' });
  });
  promise.cancel = cancel;
  return promise;
};

const sendPost = (url, params, data, _token) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    if (_token)
      axios({
        method: 'post',
        url,
        data: data,
        params,
        // baseURL: "localhost:8060",
        headers: {
          Authorization: `Bearer ${_token}`
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    else reject({ internal_error: 'Thiếu access token!' });
  });

  promise.cancel = cancel;
  return promise;
};

const sendPut = (url, params, data, _token) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    if (_token)
      axios({
        method: 'put',
        url,
        params,
        data: data,
        headers: {
          Authorization: `Bearer ${_token}`,
          'Access-Control-Allow-Origin': '*'
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    else reject({ internal_error: 'Thiếu access token!' });
  });

  promise.cancel = cancel;
  return promise;
};

const sendDelete = (url, params, _token) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    if (_token)
      axios({
        method: 'delete',
        url,
        params,
        headers: {
          Authorization: `Bearer ${_token}`
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    else reject({ internal_error: 'Thiếu access token!' });
  });
  promise.cancel = cancel;
  return promise;
};

export default {
  get: sendGet,
  put: sendPut,
  del: sendDelete,
  post: sendPost
};

import axios from 'axios';
const { CancelToken } = axios;

const sendGet = (url, params) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      params,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
      .then(res => {
        resolve(res && res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
  promise.cancel = cancel;
  return promise;
};

const sendPost = (url, params, data) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data: data,
      params,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
      .then(res => {
        resolve(res && res.data);
      })
      .catch(err => {
        reject(err);
      });
  });

  promise.cancel = cancel;
  return promise;
};

const sendPut = (url, params, data) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url,
      params,
      data: data,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
      .then(res => {
        resolve(res && res.data);
      })
      .catch(err => {
        reject(err);
      });
  });

  promise.cancel = cancel;
  return promise;
};

const sendDelete = (url, params) => {
  let cancel;
  let promise = new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url,
      params,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
      .then(res => {
        resolve(res && res.data);
      })
      .catch(err => {
        reject(err);
      });
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

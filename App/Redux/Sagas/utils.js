import axios from 'axios';

export function axiosGet(URL, config = {}) {
  return axios
    .get(URL, config)
    .then(response => {
      const { data } = response;
      if (response.status === 200) {
        return {
          success: true,
          data
        };
      }
      return {
        success: false,
        resp_status: response.status,
        data
      };
    })
    .catch(error => ({
      success: false,
      errorMessage: error.response
    }));
}

export function axiosDelete(URL, config = {}) {
  return axios
    .delete(URL, config)
    .then(response => {
      const { data } = response;
      if (response.status === 200) {
        return {
          success: true,
          data
        };
      }
      return {
        success: false,
        resp_status: response.status,
        data
      };
    })
    .catch(error => ({
      success: false,
      errorMessage: error.response
    }));
}

export function axiosPost(URL, post, config = {}) {
  return axios
    .post(URL, post, config)
    .then(response => {
      const { data } = response;

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data
        };
      }
      return {
        success: false,
        resp_status: response.status,
        data
      };
    })
    .catch(error => ({
      success: false,
      errorMessage: error.response.data
    }));
}

export function fetchPost(URL, post, apiToken, config = {}) {
  fetch(URL, {
    method: 'POST',
    redirect: 'error',
    body: JSON.stringify(post),
    headers: {
      Authorization: 'Bearer ' + apiToken
    }
  })
    .then(response => {
      // console.log(response);
      return response;
    })
    .catch(err => {
      console.info(err + ' url: ' + URL);
      return err;
    });
}

export function axiosPut(URL, post, config = {}) {
  return axios
    .put(URL, post, config)
    .then(response => {
      const { data } = response;
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data
        };
      }
      return {
        success: false,
        data
      };
    })
    .catch(error => ({
      success: false,
      errorMessage: error.response
    }));
}

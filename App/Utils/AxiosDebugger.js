import axios from 'axios';

export default function axiosDebugger() {
  if (__DEV__) {
    axios.interceptors.request.use(request => {
      console.log(
        `%c ${request.method.toUpperCase()} %c${request.url || ''}`,
        'background-color: #eeffee; color: green; font-weight: bold',
        'background-color: #eeffee; text-decoration: none'
      );
      if (request.data) console.log(request.data);
      return request;
    });

    axios.interceptors.response.use(response => {
      console.log(
        `%c ${response.status} %c${response.config.url} \n`,
        'background-color: #eeeeff; color: blue; font-weight: bold',
        'background-color: #eeeeff; color: blue; text-decoration: none',
        response.data
      );
      return response;
    });
  }
}

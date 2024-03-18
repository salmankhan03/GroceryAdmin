import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL:`https://backend.kingsmankids.com/api`, //`https://backend.canadasentinel.ca/api`,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let adminInfo;
  if (Cookies.get('adminInfo')) {
    adminInfo = JSON.parse(Cookies.get('adminInfo'));
  }

  let company;

  if (Cookies.get('company')) {
    company = Cookies.get('company');
  }

  // console.log('Admin Http Services Cookie Read : ' + company);
  // let companyName = JSON.stringify(company);

  return {
    ...config,
    headers: {
      authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
      company: company ? company : null,
    },
  };
});
// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401) status code
    if (error.response && error.response.status === 401) {
      // Redirect to the login screen or perform any other action
      // You may use a router or other method to redirect
      console.log('Unauthorized access. Redirecting to login screen.');
      // Replace the following line with your actual redirect code
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;

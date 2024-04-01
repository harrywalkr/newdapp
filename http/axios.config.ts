import axios, {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://api.dextrading.com/api/",
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Do something before request is sent
    config.params = { ...config.params, chain: "ETH" };
    return config;
  },
  (err: any) => {
    // Do something with request error
    return Promise.reject(err);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response: any) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;

import { log, logError } from "@/utils/logger";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const fetchData = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, options);
    return response.data;
  } catch (error: any) {
    logError("API call failed:", error.message);
    logError("Error Url is:", url);
    throw new Error(error.message);
  }
};

export const axiosInstance = axios.create({
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log the full request details for debugging
    log(
      `Sending request to ${config.url} with method ${config.method} and data:`,
      config.data
    );
    return config;
  },
  (error) => {
    // Log request error details
    logError("Failed to make request:", error.config);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response details for successful requests
    log(
      `Received response from ${response.config.url} with status ${response.status}:`,
      response.data
    );
    return response;
  },
  (error) => {
    // Log error details
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logError(
        `Request to ${error.response.config.url} failed with status ${error.response.status}:`,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      logError("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logError("Error setting up request:", error.message);
    }

    if (error.code !== "ERR_CANCELED") {
      logError("Unhandled error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

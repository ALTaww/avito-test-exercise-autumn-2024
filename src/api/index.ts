import axios, { AxiosInstance } from "axios";

const createAxiosInstance = (
  baseURL = process.env.REACT_APP_API_URL + "/api",
  withAuth = false
): AxiosInstance => {
  const instance = axios.create({ baseURL });

  // Перехватчик запросов
  instance.interceptors.request.use(
    (config) => {
      if (config.signal instanceof AbortSignal) {
        const cancelToken = axios.CancelToken.source();
        config.signal.addEventListener("abort", () => {
          cancelToken.cancel("Request was aborted");
        });
        config.cancelToken = cancelToken.token;
      }

      if (withAuth) {
        config.withCredentials = true;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use((response) => {
    console.log(response.config.url, response.data);
    return response;
  });

  return instance;
};

const $host = createAxiosInstance(process.env.REACT_APP_API_URL + "/api");
export { $host };
export * from "./ordersApi";
export * from "./advertisementsApi";

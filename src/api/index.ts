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

  // Перехватчик ответов
  //   if (withAuth) {
  //     let retryCount = 0;

  //     instance.interceptors.response.use(
  //       (response) => response, // Успешный ответ
  //       async (error) => {
  //         const originalRequest = error.config;

  //         // Проверяем, нужно ли обновить токены
  //         if (
  //           error.response &&
  //           error.response.status === 401 &&
  //           originalRequest &&
  //           !retryCount
  //         ) {
  //           retryCount = 1; // Устанавливаем флаг, чтобы избежать рекурсии

  //           try {
  //             await userApi.refreshTokens(); // Метод для обновления токенов
  //             return instance.request(originalRequest); // Повторяем запрос
  //           } catch (err) {
  //             showNotification(
  //               err.message || "Для этой операции нужно зарегистрироваться",
  //               notificationTimeouts.short,
  //               notificationStatuses.error
  //             );
  //             throw err;
  //           } finally {
  //             retryCount = 0; // Сбрасываем счетчик
  //           }
  //         }

  //         throw error; // Пробрасываем ошибку, если не удалось обработать
  //       }
  //     );
  //   }

  return instance;
};

const $host = createAxiosInstance(process.env.REACT_APP_API_URL + "/api");
export { $host };
export * from "./ordersApi";
export * from "./advertisementsApi";

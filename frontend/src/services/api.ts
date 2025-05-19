import axios from "axios";
import { InputParams, OutputParams } from "../types";

// Определяем API URL зависимости от окружения
// В продакшн билде через nginx API доступно по /api
// В dev режиме используется переменная окружения или дефолтное значение
const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: false,
  timeout: 30000 // Увеличиваем таймаут для возможной задержки в сети
});

export const greenplumApi = {
  calculateStorage: (params: InputParams) => {
    return api.post<OutputParams>("/calculate", params);
  },
};

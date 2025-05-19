import axios from "axios";
import { InputParams, OutputParams } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: false
});

export const greenplumApi = {
  calculateStorage: (params: InputParams) => {
    return api.post<OutputParams>("/calculate", params);
  },
};

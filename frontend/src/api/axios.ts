import axios from "axios";
import { API_BASE_URL } from "./constants";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? API_BASE_URL : "/api",
  withCredentials: true, // to save cookies
});
import axios from "axios";

const api = axios.create({
  //baseURL: "https://hotel-booking-backend-production-dc0d.up.railway.app",
  //environment variable set in .env files, accessed via import.meta.env in Vite
  //retrieved via import.env because inside browser context
  baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
    "Content-Type": "application/json",
  },
});

{/*
    Attaches the JWT token with every request
    */}
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
  //baseURL: "https://hotel-booking-backend-production-dc0d.up.railway.app",
  baseURL: "http://localhost:8080",
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

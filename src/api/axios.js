import axios from "axios";

const api = axios.create({
  //baseURL: "https://hotel-booking-backend-production-dc0d.up.railway.app",
  baseURL: "http://localhost:8080",
});

export default api;

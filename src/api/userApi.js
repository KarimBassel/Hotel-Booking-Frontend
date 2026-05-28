// api/userApi.js
import api from "./axios";

export const getProfile = () =>
  api.get("/api/users/profile", { withCredentials: true });

export const updateProfile = (payload) =>
  api.put("/api/users", payload, { withCredentials: true });
import api from "./axios";

export const getHotels = () => {
  return api.get("/api/hotels");
};

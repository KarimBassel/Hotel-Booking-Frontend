import api from "./axios";

export const getHotels = () => {
  return api.get("/api/hotels");
};

export const getHotelById = (id) => {
  return api.get(`/api/hotels/${id}`);
}

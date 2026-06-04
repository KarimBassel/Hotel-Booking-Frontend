import api from "./axios";

export const getHotels = () => {
  return api.get("/api/hotels");
};

export const getHotelById = (id) => {
  return api.get(`/api/hotels/${id}`);
}

export const deleteHotel = (id) => {
  return api.delete(`/api/hotels/${id}`);
}
export const createHotel = (payload) => {
  return api.post("/api/hotels", payload, { withCredentials: true });
}
export const updateHotel = (id, payload) => {
  return api.put(`/api/hotels/${id}`, payload, { withCredentials: true });
}

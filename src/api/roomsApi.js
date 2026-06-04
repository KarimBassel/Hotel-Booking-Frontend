import api from "./axios";

export const checkRoomAvailability = (userId) => {
  const path = userId ? `/api/roomsort /${userId}` : "/api/bookings";
  return api.get(path);
};


export const getRooms = () => {
  return api.get("/api/rooms");
};

export const getRoomById = (id) => {
  return api.get(`/api/rooms/${id}`);
};

export const getRoomsByHotel = (hotelId) => {
  return api.get(`/api/rooms/hotel/${hotelId}`);
};

export const createRoom = (data) => {
  return api.post("/api/rooms", data);
};

export const updateRoom = (id, data) => {
  return api.put(`/api/rooms/${id}`, data);
};

export const deleteRoom = (id) => {
  return api.delete(`/api/rooms/${id}`);
};
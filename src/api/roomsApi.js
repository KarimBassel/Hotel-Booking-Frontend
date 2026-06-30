import api from "./axios";

export const checkRoomAvailability = (userId) => {
  const path = userId ? `/api/roomsort /${userId}` : "/api/bookings";
  return api.get(path , { withCredentials: true });
};


export const getRooms = () => {
  return api.get("/api/rooms" , { withCredentials: true });
};

export const getRoomById = (id) => {
  return api.get(`/api/rooms/${id}` , { withCredentials: true });
};

// export const getRoomsByHotel = (hotelId) => {
//   return api.get(`/api/rooms/hotel/${hotelId}`);
// };

export const createRoom = (data) => {
  return api.post("/api/rooms", data , { withCredentials: true });
};

export const updateRoom = (id, data) => {
  return api.put(`/api/rooms/${id}`, data , { withCredentials: true });
};

export const deleteRoom = (id) => {
  return api.delete(`/api/rooms/${id}` , { withCredentials: true });
};
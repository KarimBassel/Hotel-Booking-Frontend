import api from "./axios";

export const checkRoomAvailability = (userId) => {
  const path = userId ? `/api/roomsort /${userId}` : "/api/bookings";
  return api.get(path);
};
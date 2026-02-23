import api from "./axios";

// If backend exposes bookings per user at /api/bookings/{userId}, accept an optional userId.
export const getBookings = (userId) => {
  const path = userId ? `/api/bookings/${userId}` : "/api/bookings";
  return api.get(path);
};

export const createBooking = (payload) => api.post("/api/bookings", payload, { withCredentials: true });

export const cancelBooking = (bookingId) => api.delete(`/api/bookings/${bookingId}`);

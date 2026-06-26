import api from "./axios";

// If backend exposes bookings per user at /api/bookings/{userId}, accept an optional userId.
export const getBookings = (userId) => {
  const path = userId ? `/api/bookings/${userId}` : "/api/bookings";
  return api.get(path);
};

export const createBooking = (payload) => api.post("/api/bookings", payload, { withCredentials: true });

export const updateBooking = (bookingId, status) => api.put(`/api/bookings/${bookingId}`, status);

export const getBookingById = (bookingId) => api.get(`/api/bookings/BookingStatus/${bookingId}`);


export const checkRoomAvailability = (roomId, checkIn, checkOut) => {
  const path = `/api/bookings/check-availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`;
  return api.get(path);
};
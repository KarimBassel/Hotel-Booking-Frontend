import api from "./axios";

// If backend exposes bookings per user at /api/bookings/{userId}, accept an optional userId.
export const getBookings = (userId) => {
  const path = userId ? `/api/bookings/${userId}` : "/api/bookings";
  return api.get(path , { withCredentials: true });
};

export const createBooking = (payload) => api.post("/api/bookings", payload, { withCredentials: true });

//to be edited to accept payload instead of bookingId and status
export const updateBooking = (bookingId, payload) => api.put(`/api/bookings/${bookingId}`, payload, { withCredentials: true });

export const getBookingById = (bookingId) => api.get(`/api/bookings/BookingStatus/${bookingId}` , { withCredentials: true });


export const checkRoomAvailability = (roomId, checkIn, checkOut) => {
  const path = `/api/bookings/check-availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`;
  return api.get(path , { withCredentials: true });
};
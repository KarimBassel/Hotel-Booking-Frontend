import api from "./axios"; 

/**
 * Create a PaymentIntent on the backend
 * @param {number} Amount - total amount in USD
 * @param {number} BookingID - BookingID to create payment for
 * @returns {JSON} JSON containing the client secret, payment ID, and current status of the payment
 */
export const createPaymentIntent = async (payload) => {
  const response = await api.post("/api/payments/create",payload, {
    withCredentials: true,
  });
  return response.data;
};
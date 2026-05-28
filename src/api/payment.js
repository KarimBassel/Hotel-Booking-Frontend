import api from "./axios"; 

/**
 * Create a PaymentIntent on the backend
 * @param {number} amount - total amount in USD
 * @returns {Promise<string>} clientSecret for Stripe payment
 */
export const createPaymentIntent = async (amount) => {
  try {
    console.log("Creating payment intent with amount:", amount);

    // Send the amount in the request body as JSON
    const response = await api.post("api/payments/create", {
      amount: Number(amount),
    });

    console.log("PaymentIntent response:", response.data);
    return response.data.clientSecret;
  } catch (error) {
    console.error("Payment API error:", error.response?.data || error.message);
    throw new Error("Failed to create payment intent.");
  }
};
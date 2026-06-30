import api from "./axios";


export const CreateReview = (payload) => 
    api.post("/api/reviews", payload, { withCredentials: true });

export const getUserHotelReview = (hotelId) =>
    api.get(`/api/reviews/user-review?hotelID=${hotelId}`, { withCredentials: true });

export const updateHotelReview = (payload) =>
    api.put("/api/reviews", payload, { withCredentials: true });

export const getHotelReviews = (hotelId) => {
    return api.get(`/api/reviews/hotel/${hotelId}`);
}
export const getUserReviews = () => {
    return api.get("/api/reviews/me", { withCredentials: true });
}

export const getAllReviews = () => {
    return api.get("/api/reviews" , { withCredentials: true });
}

export const deleteReview = (reviewId) => {
    return api.delete(`/api/reviews/${reviewId}`, { withCredentials: true });
}
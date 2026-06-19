import api from "./axios";

export const cleanupTestData = () => {
    return api.delete("/api/test/cleanup");
}
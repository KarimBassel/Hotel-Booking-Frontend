import api from "./axios";

// Upload Image to Cloudinary and Return the Image URL to Render in the Frontend
export const uploadImage = async (file) => {

  //Used with binary files (like images) to send data as multipart/form-data
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/uploads/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const deleteImage = async (imageURL) => {
    const response = await api.get("/api/uploads/delete-image?imageURL=" + encodeURIComponent(imageURL));
}
import dotenv from "dotenv";

export default async function globalTeardown() {
    //Loads environment variables from .env file into process.env
    dotenv.config();
  try {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/api/test/cleanup`,
      { method: "DELETE" }
    );

    console.log("Status:", response.status);
  } catch (e) {
    console.error("Cleanup failed:", e);
  }
}
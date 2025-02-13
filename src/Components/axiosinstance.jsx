import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8001/",
});
const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};
axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = Cookies.get("access_token");

  if (isTokenExpired(accessToken)) {
    console.log("Token expired, refreshing...");
    try {
      const refreshToken = Cookies.get("refresh_token");
      const { data } = await axios.post("http://127.0.0.1:8001/refresh/", {
        refresh: refreshToken,
      });

      Cookies.set("access_token", data.access);
      if (data.refresh) {
        Cookies.set("refresh_token", data.refresh);
      }
      config.headers.Authorization = `Bearer ${data.access}`;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  } else {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;

import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";

// const api = axios.create({
//     baseURL: window.location.href.split(":")[0] === "http" ? "http://localhost:5002/api/v1" : "https://web-backend-phi-seven.vercel.app/api/v1",
//     withCredentials: true,
// });

// export default api;

const api = axios.create({
  baseURL:
    window.location.href.split(":")[0] === "http"
      ? "http://localhost:5002/api/v1"
      : "https://web-backend-phi-seven.vercel.app/api/v1",
  withCredentials: true, // cookies ko automatically bhejega
});

// Centralized logout function
const LogoutFunction = () => {
  let { dispatch } = useContext(GlobalContext);

  // Clear context
  dispatch({ type: "USER_LOGOUT" });

  // Redirect to login page
  window.location.href = "/login";
};

const refreshApi = axios.create({
  baseURL:
    window.location.href.split(":")[0] === "http"
      ? "http://localhost:5002/api/v1"
      : "https://web-backend-phi-seven.vercel.app/api/v1",
  withCredentials: true,
});

// Axios interceptor
api.interceptors.response.use(
  (response) => response, // normal response
  async (error) => {
    const originalRequest = error.config;

    // 🔹 Token expired → try refresh
    if (
      error.response?.status === 401 &&
      //   error.response.data.message === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (originalRequest.url.includes("/refresh-token")) {
        return Promise.reject(error);
      }
      try {
        await refreshApi.post("/refresh-token"); // 🔥 FIX
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        console.log("Refresh token failed", refreshError);

        // Logout + redirect
        LogoutFunction();
        return Promise.reject(refreshError);
      }
    }

    // 🔹 Other 401 errors → Unauthorized, logout
    if (error.response?.status === 401) {
      console.log("Unauthorized, logging out");
      LogoutFunction();
    }

    // Any other error
    return Promise.reject(error);
  },
);

export default api;

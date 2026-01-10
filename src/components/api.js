import axios from "axios";

const api = axios.create({
    baseURL: window.location.href.split(":")[0] == "http" ? "http://localhost:5002/api/v1" : "https://web-backend-phi-seven.vercel.app/api/v1",
    withCredentials: true,
});

export default api;
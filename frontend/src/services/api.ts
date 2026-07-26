import axios from "axios";

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
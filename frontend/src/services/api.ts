import axios from "axios";

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // token expire → login pe bhejo
    }
    return Promise.reject(error);
  }
);

export default api;
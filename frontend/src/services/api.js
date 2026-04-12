import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

//Attach JWT token to every token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fn_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//Handle 401 globally

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fn_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//Auth
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

//Houses
export const houseAPI = {
  create: (data) => api.post("/houses/create", data),
  join: (data) => api.post("/houses/join", data),
  getAll: () => api.get("/houses"),
  getById: (id) => api.get(`/houses/${id}`),
  regenerateCode: (id) => api.patch(`/houses/${id}/regenerate-code`),
  leave: (id) => api.delete(`/houses/${id}/leave`),
};

//Grocery Item

export const itemApi = {
  getByHouse: (houseId, params) => api.get(`/items/${houseId}`, { params }),
  add: (data) => api.post(`/items/${houseId}`, data),
  update: (id, data) => api.put(`/items/${id}`, data),
  togglePurchased: (id) => api.patch(`/items/${id}/purchased`),
  delete: (id) => api.delete(`/items/${id}`),
  clearPurchased: (houseId) => api.delete(`/items/${houseId}/clear-purchased`),
};

export default api;

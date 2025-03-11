import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Add a request interceptor to automatically add the token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

export const urlService = {
  shortenUrl: async (longUrl: string) => {
    const response = await api.post("/urls/shorten", { longUrl });
    return response.data;
  },

  getUrls: async () => {
    const response = await api.get("/urls");
    return response.data;
  },

  getUrlAnalytics: async (shortUrl: string) => {
    const response = await api.get(`/urls/${shortUrl}`);
    return response.data;
  },
};

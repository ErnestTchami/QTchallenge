import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const getShortUrl = (shortUrl: string) =>
  `${API_URL}/urls/r/${shortUrl}`;

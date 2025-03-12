import { Url } from "@/types/url";
import axios from "axios";
import { API_URL } from "./constant";

export interface CreateUrlData {
  originalUrl: string;
}

export const urlService = {
  createShortUrl: async (data: string): Promise<Url> => {
    const token = sessionStorage.getItem("accessToken");
    const response = await axios.post(
      `${API_URL}/urls`,
      { long_url: `${data}` },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  getUserUrls: async (): Promise<Url[]> => {
    const token = sessionStorage.getItem("accessToken");
    const response = await axios.get(`${API_URL}/urls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteUrl: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/urls/${id}`);
  },
};

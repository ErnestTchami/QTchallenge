import { Url } from "@/types/url";
import axios from "axios";

export interface CreateUrlData {
  originalUrl: string;
}

export const urlService = {
  createShortUrl: async (data: string): Promise<Url> => {
    const token = sessionStorage.getItem("accessToken");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/urls`,
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
    console.log(
      sessionStorage.getItem("accessToken"),
      "-----------------------------token"
    );
    const token = sessionStorage.getItem("accessToken");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/urls`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteUrl: async (id: number): Promise<void> => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/urls/${id}`);
  },
};

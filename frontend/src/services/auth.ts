import axios from "axios";
import dotenv from "dotenv";
import { API_URL } from "./constant";

dotenv.config();

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  message: string;
  refreshToken?: string;
  accessToken?: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);

    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const ressponse = await axios.post(`${API_URL}/auth/logout`, {
      refreshToken: sessionStorage.getItem("refreshToken"),
    });
    return ressponse.data;
  },
};

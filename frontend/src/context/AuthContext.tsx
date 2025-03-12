"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthState } from "@/types/auth";
import { authService } from "@/services/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, password: string, email: string) => Promise<any>;
  logout: () => Promise<void>;
  userData: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState & { userData: any }>({
    data: null,
    isAuthenticated: false,
    isLoading: true,
    userData: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const accessToken = sessionStorage.getItem("accessToken");

        if (userData && accessToken) {
          const user = JSON.parse(userData);
          setAuthState({
            data: user,
            isAuthenticated: true,
            isLoading: false,
            userData: user,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const userData = {
        ...response.user,
        response,
      };

      // Save to localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("refreshToken", response?.refreshToken);
      sessionStorage.setItem("accessToken", response?.accessToken);
      setAuthState({
        data: userData,
        isAuthenticated: true,
        isLoading: false,
        userData: userData,
      });

      return response;
    } catch (error) {
      localStorage.removeItem("userData");
      setAuthState({
        data: null,
        isAuthenticated: false,
        isLoading: false,
        userData: null,
      });
      throw error;
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const response = await authService.register({
        username,
        password,
        email,
      });

      return response;
    } catch (error) {
      localStorage.removeItem("userData");
      setAuthState({
        data: null,
        isAuthenticated: false,
        isLoading: false,
        userData: null,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      localStorage.removeItem("userData");
      setAuthState({
        data: null,
        isAuthenticated: false,
        isLoading: false,
        userData: null,
      });
      sessionStorage.removeItem("refreshToken");
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUserData = () => {
  const { userData } = useAuth();
  return userData;
};

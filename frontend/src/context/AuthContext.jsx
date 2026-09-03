import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("tb_user");

    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      localStorage.removeItem("tb_user");
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("tb_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tb_user");
    }
  }, [user]);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;

    if (!data.token) {
      throw new Error("Login successful but token was not returned.");
    }

    localStorage.setItem("tb_token", data.token);
    localStorage.setItem("tb_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  }

  async function register(payload) {
    const response = await api.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || "traveler",
    });

    const data = response.data;

    if (!data.token) {
      throw new Error("Registration successful but token was not returned.");
    }

    localStorage.setItem("tb_token", data.token);
    localStorage.setItem("tb_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
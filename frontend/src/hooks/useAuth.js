import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, register as registerApi } from "../api/auth";
import useAuthStore from "../store/authStore";

export function useAuth() {
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (email, password) => {
      const { data } = await loginApi(email, password);
      login(data.user ?? null, data.access, data.refresh);
      navigate("/");
    },
    [login, navigate]
  );

  const handleRegister = useCallback(
    async (name, email, password) => {
      const { data } = await registerApi({ name, email, password });
      login(data.user, data.access, data.refresh);
      navigate("/");
    },
    [login, navigate]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/auth");
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    handleLogin,
    handleRegister,
    handleLogout,
  };
}

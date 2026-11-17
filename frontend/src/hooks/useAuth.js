import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Returns { user, loading, isAuthenticated, login, register, logout, refreshUser }.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

export default useAuth;

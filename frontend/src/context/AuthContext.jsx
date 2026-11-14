/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/authService";


export const AuthContext = createContext(null);

// Turn an Axios error into a friendly Error the forms can show.
function toError(err, fallback) {
  const data = err?.response?.data;
  const error = new Error(data?.error || data?.message || err?.message || fallback);
  error.fields = data?.errors ?? null; // field-level errors, if Flask sends them
  return error;
}

const extractUser = (data) => data?.user ?? data ?? null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we know whether a session already exists
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      const current = extractUser(data);
      setUser(current);
      return current;
    } catch {
      setUser(null); // 401 = not logged in, which is normal
      return null;
    }
  }, []);
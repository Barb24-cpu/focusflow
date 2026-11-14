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


  // On first load, ask Flask whether the session cookie is still valid.
  useEffect(() => {
    let ignore = false;
    authService
      .getCurrentUser()
      .then((data) => {
        if (!ignore) setUser(extractUser(data));
      })
      .catch(() => {
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      const current = extractUser(data);
      setUser(current);
      return current;
    } catch (err) {
      throw toError(err, "Could not log in. Please try again.");
    }
  }, []);

  const register = useCallback(
    async (details) => {
      try {
        await authService.register(details);
      } catch (err) {
        throw toError(err, "Could not create your account. Please try again.");
      }
      // Works whether or not Flask logs the user in after registering.
      return refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null); // clear the UI even if the request fails
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
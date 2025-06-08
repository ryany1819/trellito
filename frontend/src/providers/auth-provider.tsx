import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AUTH_API_URL } from "@/config";

export type User = {
  id: string;
  avatar?: string;
  email?: string;
  name?: string;
  roles?: string[];
};

type AuthContextState = {
  isLoggedIn: boolean;
  user?: User;
  accessToken?: string;
  loading: boolean;
  error?: string;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  register?: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | undefined>();
  const [accessToken, setAccessToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // refresh token logic on mount
  useEffect(() => {
    const tryRefresh = async () => {
      setLoading(true);
      setError(undefined);
      try {
        // attempt to refresh the access token using the HTTP-only cookie. returns access token.
        const res = await fetch(`${AUTH_API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        } else {
          setAccessToken(undefined);
        }
      } catch (err) {
        setAccessToken(undefined);
        console.error("Error refreshing token:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  // retieve user data on access token change
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(undefined);
    const fetchUser = async () => {
      try {
        // returns user data based on access token
        const res = await fetch(`${AUTH_API_URL}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          setUser(undefined);
          return;
        }
        const user: User = await res.json();
        setUser(user);
      } catch (err) {
        setUser(undefined);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [accessToken]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Login failed");
      }
      const data = await res.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setAccessToken(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${AUTH_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Logout failed");
      }
      setAccessToken(undefined);
    } catch (err) {
      setAccessToken(undefined);
      setError(err instanceof Error ? err.message : "Unknown error");
      // No setUser here
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }
      const data = await res.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      setAccessToken(undefined);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await fetch(`${AUTH_API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Refresh token failed");
        }
        const data = await res.json();
        setAccessToken(data.accessToken);
      } catch (err) {
        setAccessToken(undefined);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (!accessToken) return;
    const [, payload] = accessToken.split(".");
    const { exp } = JSON.parse(atob(payload));
    const expiresIn = exp * 1000 - Date.now();
    // Refresh 1 minute before expiry, but not less than 1 second from now
    const refreshIn = Math.max(expiresIn - 60_000, 1000);

    const timer = setTimeout(() => {
      refreshToken();
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [accessToken]);

  const value: AuthContextState = {
    isLoggedIn: !!accessToken,
    user,
    accessToken,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

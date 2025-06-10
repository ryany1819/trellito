import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { AUTH_API_URL, BACKEND_URL } from "@/config";
import type { User } from "@/models/user";
import { setAccessToken } from "@/slices/authSlice";
import type { RootState } from "@/store";
import type { UserDto } from "@/dto/user";

type AuthContextState = {
  isLoggedIn: boolean;
  user?: User;
  accessToken: string | null;
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
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // refresh token logic on mount
  useEffect(() => {
    const tryRefresh = async () => {
      console.log("Attempting to refresh access token...");
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
          dispatch(setAccessToken(data.accessToken));
        } else {
          dispatch(setAccessToken(null));
        }
      } catch (err) {
        dispatch(setAccessToken(null));
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
        const res = await fetch(`${BACKEND_URL}/me`, {
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
        const userDto: UserDto = await res.json();
        const user: User = {
          id: userDto.id,
          email: userDto.email,
          name: userDto.displayName,
          avatar: userDto.avatarUrl,
        }
        console.log("Fetched user data:", user);
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
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }
      const data = await res.json();
      dispatch(setAccessToken(data.accessToken));
    } catch (err) {
      console.log("hello: ", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      dispatch(setAccessToken(null));
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
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Logout failed");
      }
      dispatch(setAccessToken(null));
    } catch (err) {
      dispatch(setAccessToken(null));
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
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }
      const data = await res.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      dispatch(setAccessToken(null));
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
          const errorData = await res.json();
          throw new Error(errorData.error || "Refresh token failed");
        }
        const data = await res.json();
        dispatch(setAccessToken(data.accessToken));
      } catch (err) {
        dispatch(setAccessToken(null));
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

import React, {
	createContext,
	useContext,
	useCallback,
	useEffect,
	useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { trellitoApi } from "@/api/trellitoApi";
import { AUTH_API_URL } from "@/config";
import type { User } from "@/models/user";
import { setAccessToken } from "@/slices/authSlice";
import type { RootState } from "@/store";

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
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();

	const {
		data: user,
		isLoading: userLoading,
		error: userError,
	} = trellitoApi.useGetMeQuery(undefined, { skip: !accessToken });

	const renewAccessToken = useCallback(async () => {
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
			console.error("Error refreshing token:", err);
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	const login = useCallback(
		async (email: string, password: string) => {
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
				console.error("Login error:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				dispatch(setAccessToken(null));
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

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
		} finally {
			setLoading(false);
		}
	}, [dispatch, accessToken]);

	const register = useCallback(
		async (email: string, password: string) => {
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
				dispatch(setAccessToken(data.accessToken));
			} catch (err) {
				dispatch(setAccessToken(null));
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	// refresh token logic on mount
	useEffect(() => {
		renewAccessToken();
	}, [renewAccessToken]);

	// access token refresh timer
	useEffect(() => {
		if (!accessToken) return;

		try {
			const [, payload] = accessToken.split(".");
      if (!payload) throw new Error("Invalid token format");
			const { exp } = JSON.parse(atob(payload));
			const expiresIn = exp * 1000 - Date.now();
			// Refresh 1 minute before expiry, but not less than 1 second from now
			const refreshIn = Math.max(expiresIn - 60_000, 1000);

			const timer = setTimeout(() => {
				renewAccessToken();
			}, refreshIn);

			return () => clearTimeout(timer);
		} catch (err) {
			console.error("Error setting up token refresh:", err);
			dispatch(setAccessToken(null));
		}
	}, [accessToken, renewAccessToken]);

	const value: AuthContextState = {
		isLoggedIn: !!accessToken && !!user,
		user,
		accessToken,
		loading: loading || userLoading,
		error: error || (userError ? String(userError) : undefined),
		login,
		logout,
		register,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

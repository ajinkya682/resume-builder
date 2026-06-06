"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { AuthState, AuthAction, AuthUser } from "@/types/frontend.types";
import { authService } from "@/services/authService";
import { LoginBody, RegisterBody } from "@/types/user.types";
import { useRouter } from "next/navigation";

// ─── State & Reducer ──────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (body: LoginBody) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const USER_STORAGE_KEY = "rb_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const user: AuthUser = JSON.parse(stored);
        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = useCallback(async (body: LoginBody) => {
    const user = await authService.login(body);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const register = useCallback(async (body: RegisterBody) => {
    const user = await authService.register(body);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best-effort — clear client state regardless
    }
    localStorage.removeItem(USER_STORAGE_KEY);
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

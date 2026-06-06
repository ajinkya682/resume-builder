import api from "./api";
import { LoginBody, RegisterBody } from "@/types/user.types";
import { AuthUser } from "@/types/frontend.types";

export const authService = {
  async register(body: RegisterBody): Promise<AuthUser> {
    const res = await api.post("/auth/register", body);
    return (res.data.data as { user: AuthUser }).user;
  },

  async login(body: LoginBody): Promise<AuthUser> {
    const res = await api.post("/auth/login", body);
    return (res.data.data as { user: AuthUser }).user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

import { JWTPayLoad } from "@/types/user.types";
import jwt from "jsonwebtoken";

export const generateToken = (payload: JWTPayLoad): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

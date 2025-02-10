import jwt from "jsonwebtoken";
import User from "../models/user";

const SECRET_KEY = process.env.JWT_TOKEN_SECRET || "my-secret-key";
const expiresIn: any = process.env.JWT_TOKEN_EXPIRY || "1h";

export const generateToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, userName: user.userName },
    SECRET_KEY,
    { expiresIn: expiresIn } 
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};


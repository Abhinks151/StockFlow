import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

const MESSAGES = {
  UNAUTHORIZED: "Unauthorized access: Token missing or invalid",
} as const;

interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  console.log(req.path);
  if (req.path === "/api/users/register" || req.path === "/api/users/login") {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED,
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED,
    });
    return;
  }
};

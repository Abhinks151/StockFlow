"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HTTP_STATUS = {
    UNAUTHORIZED: 401,
};
const MESSAGES = {
    UNAUTHORIZED: "Unauthorized access: Token missing or invalid",
};
const authenticateToken = (req, res, next) => {
    console.log(req.path);
    if (req.path === "/api/users/register" || req.path === "/api/users/login") {
        next();
        return;
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.UNAUTHORIZED,
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;

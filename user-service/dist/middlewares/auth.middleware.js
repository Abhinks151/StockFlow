"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCodes_1 = require("../constants/statusCodes");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
        res.status(statusCodes_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: statusCodes_1.MESSAGES.UNAUTHORIZED,
        });
        return;
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(statusCodes_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: statusCodes_1.MESSAGES.UNAUTHORIZED,
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;

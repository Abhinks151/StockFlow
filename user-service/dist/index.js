"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const statusCodes_1 = require("./constants/statusCodes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Middleware
app.use(express_1.default.json());
// Health Check
app.get("/health", (_req, res) => {
    res.status(statusCodes_1.HTTP_STATUS.OK).send("Ok");
});
// Routes
app.use("/api/users", user_routes_1.default);
// Also support root /user or /users for convenience
app.use("/user", user_routes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`User Service running at http://localhost:${PORT}`);
});
exports.default = app;

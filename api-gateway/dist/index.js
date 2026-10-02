"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(auth_middleware_1.authenticateToken);
app.use("/api/users", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://user-service:3000/api/users",
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req) => {
            // Rebuild the body because express.json() parsed it // test it 
            (0, http_proxy_middleware_1.fixRequestBody)(proxyReq, req);
            // Forward authenticated user information
            const authReq = req;
            if (authReq.user) {
                proxyReq.setHeader("X-User-Id", authReq.user.userId);
                proxyReq.setHeader("X-User-Email", authReq.user.email);
            }
        },
    },
}));
app.use("/api/products", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://inventory-service:3002/api/products",
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req) => {
            (0, http_proxy_middleware_1.fixRequestBody)(proxyReq, req);
        }
    }
}));
app.get("/health", (_req, res) => {
    res.status(200).send("Ok");
});
app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import {
  createProxyMiddleware,
  fixRequestBody,
} from "http-proxy-middleware";
import { authenticateToken, AuthRequest } from "./middleware/auth.middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;



app.use(authenticateToken);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://user-service:3000/api/users",
    changeOrigin: true,

    on: {
      proxyReq: (proxyReq, req) => {
        // Rebuild the body because express.json() parsed it // test it 
        fixRequestBody(proxyReq, req);

        // Forward authenticated user information
        const authReq = req as AuthRequest;

        if (authReq.user) {
          proxyReq.setHeader("X-User-Id", authReq.user.userId);
          proxyReq.setHeader("X-User-Email", authReq.user.email);
        }
      },
    },
  })
);

app.get("/health", (_req, res) => {
  res.status(200).send("Ok");
});

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
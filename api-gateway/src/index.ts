import express from "express";
import dotenv from "dotenv";
import {
  createProxyMiddleware,
  fixRequestBody,
} from "http-proxy-middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://user-service:3000/api/users",
    changeOrigin: true,

    on: {
      proxyReq: fixRequestBody,
    },
  })
);

app.get("/health", (_req, res) => {
  res.status(200).send("Ok");
});

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
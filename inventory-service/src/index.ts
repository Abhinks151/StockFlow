import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import productRoutes from "./routes/product.routes";
import { HTTP_STATUS } from "./constants/statusCodes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3002;

connectDB();

app.use(express.json());

// Health Check
app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).send("Ok");
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Inventory Service running at http://localhost:${PORT}`);
});

export default app;
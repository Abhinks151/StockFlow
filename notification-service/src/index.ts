import express from "express";
import dotenv from "dotenv";
import { startNotificationConsumer } from "./events/consumer";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3004;

app.use(express.json());

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).send("Ok");
});

// Start HTTP server & RabbitMQ Consumer
app.listen(PORT, () => {
  console.log(`Notification Service HTTP running at http://localhost:${PORT}`);
  startNotificationConsumer();
});

export default app;

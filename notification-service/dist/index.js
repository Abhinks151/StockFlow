"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const consumer_1 = require("./events/consumer");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3004;
app.use(express_1.default.json());
// Health Check
app.get("/health", (_req, res) => {
    res.status(200).send("Ok");
});
// Start HTTP server & RabbitMQ Consumer
app.listen(PORT, () => {
    console.log(`Notification Service HTTP running at http://localhost:${PORT}`);
    (0, consumer_1.startNotificationConsumer)();
});
exports.default = app;

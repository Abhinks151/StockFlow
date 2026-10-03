"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNotificationConsumer = startNotificationConsumer;
const amqplib_1 = __importDefault(require("amqplib"));
const email_service_1 = require("../services/email.service");
const EXCHANGE_NAME = "stockflow.events";
const QUEUE_NAME = "notification.order_created";
const ROUTING_KEY = "order.created";
const emailService = new email_service_1.EmailService();
async function startNotificationConsumer() {
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
    try {
        const connection = await amqplib_1.default.connect(rabbitUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
        console.log(`[Notification Service] 🐰 Connected to RabbitMQ at ${rabbitUrl}`);
        console.log(`[Notification Service] 📥 Listening for '${ROUTING_KEY}' events on queue '${QUEUE_NAME}'...`);
        channel.consume(QUEUE_NAME, async (msg) => {
            if (!msg)
                return;
            try {
                const content = msg.content.toString();
                console.log(`[Notification Service] 📩 Received OrderCreated event:`, content);
                const payload = JSON.parse(content);
                await emailService.sendOrderConfirmationEmail(payload);
                channel.ack(msg);
            }
            catch (err) {
                console.error(`[Notification Service] ❌ Error handling message:`, err);
                // Reject and don't requue broken JSON if malformed
                channel.nack(msg, false, false);
            }
        });
    }
    catch (error) {
        console.error(`[Notification Service] ❌ Failed to start RabbitMQ consumer:`, error);
        // Retry connection after delay
        setTimeout(startNotificationConsumer, 5000);
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
exports.publishOrderCreated = publishOrderCreated;
const amqplib_1 = __importDefault(require("amqplib"));
let channel = null;
const EXCHANGE_NAME = "stockflow.events";
const ROUTING_KEY = "order.created";
async function connectRabbitMQ() {
    if (channel)
        return channel;
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
    try {
        const conn = await amqplib_1.default.connect(rabbitUrl);
        const ch = await conn.createChannel();
        await ch.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
        console.log(`Connected to RabbitMQ at ${rabbitUrl} (Exchange: ${EXCHANGE_NAME})`);
        channel = ch;
        return channel;
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
}
async function publishOrderCreated(eventPayload) {
    try {
        const ch = await connectRabbitMQ();
        const message = Buffer.from(JSON.stringify(eventPayload));
        const published = ch.publish(EXCHANGE_NAME, ROUTING_KEY, message, {
            persistent: true,
        });
        console.log(`Published OrderCreated event for Order #${eventPayload.orderId}`);
        return published;
    }
    catch (error) {
        console.error("Error publishing OrderCreated event:", error);
        return false;
    }
}

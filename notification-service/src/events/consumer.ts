import amqp from "amqplib";
import { EmailService, OrderNotificationPayload } from "../services/email.service";

const EXCHANGE_NAME = "stockflow.events";
const QUEUE_NAME = "notification.order_created";
const ROUTING_KEY = "order.created";

const emailService = new EmailService();

export async function startNotificationConsumer() {
  const rabbitUrl = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    console.log(`[Notification Service] 🐰 Connected to RabbitMQ at ${rabbitUrl}`);
    console.log(`[Notification Service] 📥 Listening for '${ROUTING_KEY}' events on queue '${QUEUE_NAME}'...`);

    channel.consume(QUEUE_NAME, async (msg: amqp.ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        console.log(`[Notification Service] 📩 Received OrderCreated event:`, content);

        const payload: OrderNotificationPayload = JSON.parse(content);
        await emailService.sendOrderConfirmationEmail(payload);

        channel.ack(msg);
      } catch (err) {
        console.error(`[Notification Service] ❌ Error handling message:`, err);
        // Reject and don't requue broken JSON if malformed
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error(`[Notification Service] ❌ Failed to start RabbitMQ consumer:`, error);
    // Retry connection after delay
    setTimeout(startNotificationConsumer, 5000);
  }
}

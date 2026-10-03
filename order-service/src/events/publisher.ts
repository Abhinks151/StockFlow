import amqp from "amqplib";

let channel: amqp.Channel | null = null;

const EXCHANGE_NAME = "stockflow.events";
const ROUTING_KEY = "order.created";

export async function connectRabbitMQ(): Promise<amqp.Channel> {
  if (channel) return channel;

  const rabbitUrl = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  try {
    const conn = await amqp.connect(rabbitUrl);
    const ch = await conn.createChannel();

    await ch.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
    console.log(`Connected to RabbitMQ at ${rabbitUrl} (Exchange: ${EXCHANGE_NAME})`);
    channel = ch;
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

export async function publishOrderCreated(eventPayload: {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt?: string | Date;
}): Promise<boolean> {
  try {
    const ch = await connectRabbitMQ();
    const message = Buffer.from(JSON.stringify(eventPayload));
    const published = ch.publish(EXCHANGE_NAME, ROUTING_KEY, message, {
      persistent: true,
    });
    console.log(`Published OrderCreated event for Order #${eventPayload.orderId}`);
    return published;
  } catch (error) {
    console.error("Error publishing OrderCreated event:", error);
    return false;
  }
}

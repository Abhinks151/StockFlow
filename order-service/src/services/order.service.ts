import { OrderRepository } from "../repositories/order.repository";
import { ICreateOrderDTO, OrderStatus } from "../interfaces/order.interface";
import { HTTP_STATUS, MESSAGES } from "../constants/statusCodes";
import {
  getProductFromInventory,
  deductStockFromInventory,
} from "../clients/inventory.client";
import { getUserFromUserService } from "../clients/user.client";
import { publishOrderCreated } from "../events/publisher";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(dto: ICreateOrderDTO) {
    const { userId, productId, quantity } = dto;

    if (!userId) {
      throw {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.UNAUTHORIZED,
      };
    }

    if (!productId || quantity === undefined || quantity === null) {
      throw {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
      };
    }

    if (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
      throw {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.INVALID_QUANTITY,
      };
    }

    // 1. Fetch user details from User Service via gRPC
    let user: any;
    try {
      user = await getUserFromUserService(userId);
    } catch (error: any) {
      throw {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "User not found or User Service unreachable via gRPC",
      };
    }

    // 2. Fetch product details from Inventory Service via gRPC
    let product: any;
    try {
      product = await getProductFromInventory(productId);
    } catch (error: any) {
      throw {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      };
    }

    // 3. Check stock availability
    if (product.stock < quantity) {
      throw {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.INSUFFICIENT_STOCK,
      };
    }

    // 4. Deduct stock via gRPC
    const deductResult = await deductStockFromInventory(productId, quantity);
    if (!deductResult.success) {
      throw {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: deductResult.message || MESSAGES.INSUFFICIENT_STOCK,
      };
    }

    // 5. Calculate total amount (quantity * unit price)
    const totalAmount = product.amount * quantity;

    // 6. Create and persist Order
    const order = await this.orderRepository.create({
      userId,
      productId,
      quantity,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    // 7. Publish OrderCreated event asynchronously via RabbitMQ
    await publishOrderCreated({
      orderId: (order as any)._id ? (order as any)._id.toString() : (order as any).id,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      productId,
      productName: product.name,
      quantity,
      totalAmount,
      status: order.status,
      createdAt: (order as any).createdAt,
    });

    return order;
  }

  async getOrdersByUser(userId: string) {
    if (!userId) {
      throw {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.UNAUTHORIZED,
      };
    }
    return await this.orderRepository.findByUserId(userId);
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.ORDER_NOT_FOUND,
      };
    }
    return order;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_repository_1 = require("../repositories/order.repository");
const order_interface_1 = require("../interfaces/order.interface");
const statusCodes_1 = require("../constants/statusCodes");
const inventory_client_1 = require("../clients/inventory.client");
const user_client_1 = require("../clients/user.client");
const publisher_1 = require("../events/publisher");
class OrderService {
    orderRepository;
    constructor() {
        this.orderRepository = new order_repository_1.OrderRepository();
    }
    async createOrder(dto) {
        const { userId, productId, quantity } = dto;
        if (!userId) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.UNAUTHORIZED,
                message: statusCodes_1.MESSAGES.UNAUTHORIZED,
            };
        }
        if (!productId || quantity === undefined || quantity === null) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST,
                message: statusCodes_1.MESSAGES.MISSING_REQUIRED_FIELDS,
            };
        }
        if (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST,
                message: statusCodes_1.MESSAGES.INVALID_QUANTITY,
            };
        }
        // 1. Fetch user details from User Service via gRPC
        let user;
        try {
            user = await (0, user_client_1.getUserFromUserService)(userId);
        }
        catch (error) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.NOT_FOUND,
                message: "User not found or User Service unreachable via gRPC",
            };
        }
        // 2. Fetch product details from Inventory Service via gRPC
        let product;
        try {
            product = await (0, inventory_client_1.getProductFromInventory)(productId);
        }
        catch (error) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.NOT_FOUND,
                message: statusCodes_1.MESSAGES.PRODUCT_NOT_FOUND,
            };
        }
        // 3. Check stock availability
        if (product.stock < quantity) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST,
                message: statusCodes_1.MESSAGES.INSUFFICIENT_STOCK,
            };
        }
        // 4. Deduct stock via gRPC
        const deductResult = await (0, inventory_client_1.deductStockFromInventory)(productId, quantity);
        if (!deductResult.success) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST,
                message: deductResult.message || statusCodes_1.MESSAGES.INSUFFICIENT_STOCK,
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
            status: order_interface_1.OrderStatus.PENDING,
        });
        // 7. Publish OrderCreated event asynchronously via RabbitMQ
        await (0, publisher_1.publishOrderCreated)({
            orderId: order._id ? order._id.toString() : order.id,
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            productId,
            productName: product.name,
            quantity,
            totalAmount,
            status: order.status,
            createdAt: order.createdAt,
        });
        return order;
    }
    async getOrdersByUser(userId) {
        if (!userId) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.UNAUTHORIZED,
                message: statusCodes_1.MESSAGES.UNAUTHORIZED,
            };
        }
        return await this.orderRepository.findByUserId(userId);
    }
    async getOrderById(id) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw {
                statusCode: statusCodes_1.HTTP_STATUS.NOT_FOUND,
                message: statusCodes_1.MESSAGES.ORDER_NOT_FOUND,
            };
        }
        return order;
    }
}
exports.OrderService = OrderService;

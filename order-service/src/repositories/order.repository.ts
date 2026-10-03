import { OrderModel, IOrderDocument } from "../models/order.model";
import { OrderStatus } from "../interfaces/order.interface";

export class OrderRepository {
  async create(data: {
    userId: string;
    productId: string;
    quantity: number;
    totalAmount: number;
    status?: OrderStatus;
  }): Promise<IOrderDocument> {
    return await OrderModel.create(data);
  }

  async findById(id: string): Promise<IOrderDocument | null> {
    return await OrderModel.findById(id);
  }

  async findByUserId(userId: string): Promise<IOrderDocument[]> {
    return await OrderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<IOrderDocument[]> {
    return await OrderModel.find().sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<IOrderDocument | null> {
    return await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}

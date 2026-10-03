export enum OrderStatus {
  PENDING = "pending",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
}

export interface IOrder {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateOrderDTO {
  userId: string;
  productId: string;
  quantity: number;
}

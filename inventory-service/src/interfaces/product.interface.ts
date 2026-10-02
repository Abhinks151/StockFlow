export interface IProduct {
  id: string;
  name: string;
  description?: string | null;
  stock: number;
  category: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProductDTO {
  name: string;
  description?: string;
  stock: number;
  category: string;
  amount: number;
}

export interface IUpdateProductDTO {
  name?: string;
  description?: string;
  stock?: number;
  category?: string;
  amount?: number;
}

export interface IUpdateStockDTO {
  stock: number;
}

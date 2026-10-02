export interface IProduct {
  id: string;
  name: string;
  description?: string | null;
  stock: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProductDTO {
  name: string;
  description?: string;
  stock: number;
  category: string;
}

export interface IUpdateProductDTO {
  name?: string;
  description?: string;
  stock?: number;
  category?: string;
}

export interface IUpdateStockDTO {
  stock: number;
}

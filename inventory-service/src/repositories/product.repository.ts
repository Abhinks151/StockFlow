import { prisma } from "../config/db";
import { ICreateProductDTO, IUpdateProductDTO, IUpdateStockDTO } from "../interfaces/product.interface";

export class ProductRepository {
  async create(data: ICreateProductDTO) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        stock: data.stock,
        category: data.category,
        amount: data.amount,
      },
    });
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateById(id: string, data: IUpdateProductDTO) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async updateStockById(id: string, dto: IUpdateStockDTO) {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: dto.stock,
      },
    });
  }
}

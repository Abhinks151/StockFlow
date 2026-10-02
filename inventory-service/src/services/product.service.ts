import { ProductRepository } from "../repositories/product.repository";
import { ICreateProductDTO, IUpdateProductDTO, IUpdateStockDTO } from "../interfaces/product.interface";
import { MESSAGES, HTTP_STATUS } from "../constants/statusCodes";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(dto: ICreateProductDTO) {
    const { name, category, stock, amount, description } = dto;

    if (!name || !category || stock === undefined || stock === null || amount === undefined || amount === null) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.MISSING_REQUIRED_FIELDS };
    }

    if (typeof name !== "string" || !name.trim()) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.NAME_CANNOT_BE_EMPTY };
    }

    if (typeof category !== "string" || !category.trim()) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.CATEGORY_CANNOT_BE_EMPTY };
    }

    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_STOCK_VALUE };
    }

    if (typeof amount !== "number" || amount < 0 || isNaN(amount)) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_AMOUNT_VALUE };
    }

    return await this.productRepository.create({
      name: name.trim(),
      category: category.trim(),
      stock,
      amount,
      description: description ? description.trim() : undefined,
    });
  }

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw { statusCode: HTTP_STATUS.NOT_FOUND, message: MESSAGES.PRODUCT_NOT_FOUND };
    }
    return product;
  }

  async updateProduct(id: string, dto: IUpdateProductDTO) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw { statusCode: HTTP_STATUS.NOT_FOUND, message: MESSAGES.PRODUCT_NOT_FOUND };
    }

    const updateData: IUpdateProductDTO = {};

    if (dto.name !== undefined) {
      if (typeof dto.name !== "string" || !dto.name.trim()) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.NAME_CANNOT_BE_EMPTY };
      }
      updateData.name = dto.name.trim();
    }

    if (dto.category !== undefined) {
      if (typeof dto.category !== "string" || !dto.category.trim()) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.CATEGORY_CANNOT_BE_EMPTY };
      }
      updateData.category = dto.category.trim();
    }

    if (dto.stock !== undefined) {
      if (typeof dto.stock !== "number" || dto.stock < 0 || !Number.isInteger(dto.stock)) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_STOCK_VALUE };
      }
      updateData.stock = dto.stock;
    }

    if (dto.amount !== undefined) {
      if (typeof dto.amount !== "number" || dto.amount < 0 || isNaN(dto.amount)) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_AMOUNT_VALUE };
      }
      updateData.amount = dto.amount;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description ? dto.description.trim() : "";
    }

    return await this.productRepository.updateById(id, updateData);
  }

  async updateStock(id: string, dto: IUpdateStockDTO) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw { statusCode: HTTP_STATUS.NOT_FOUND, message: MESSAGES.PRODUCT_NOT_FOUND };
    }

    if (dto.stock === undefined || dto.stock === null || typeof dto.stock !== "number" || dto.stock < 0 || !Number.isInteger(dto.stock)) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_STOCK_VALUE };
    }

    return await this.productRepository.updateStockById(id, { stock: dto.stock });
  }
}

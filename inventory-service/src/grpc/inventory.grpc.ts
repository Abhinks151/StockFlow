import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProductService } from "../services/product.service";

const PROTO_PATH = path.join(process.cwd(), "proto/inventory.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const inventoryProto = (grpc.loadPackageDefinition(packageDefinition) as any).inventory;
const productService = new ProductService();

export function startGrpcServer(port: number = 50051) {
  const server = new grpc.Server();

  server.addService(inventoryProto.InventoryService.service, {
    GetProduct: async (call: any, callback: any) => {
      try {
        const product = await productService.getProductById(call.request.id);
        callback(null, {
          id: product.id,
          name: product.name,
          stock: product.stock,
          amount: product.amount,
          category: product.category,
        });
      } catch (error: any) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: error.message || "Product not found",
        });
      }
    },
    DeductStock: async (call: any, callback: any) => {
      try {
        const { productId, quantity } = call.request;
        const product = await productService.getProductById(productId);

        if (product.stock < quantity) {
          callback(null, {
            success: false,
            message: "Insufficient stock available",
            remainingStock: product.stock,
          });
          return;
        }

        const updated = await productService.updateStock(productId, {
          stock: product.stock - quantity,
        });

        callback(null, {
          success: true,
          message: "Stock deducted successfully",
          remainingStock: updated.stock,
        });
      } catch (error: any) {
        callback({
          code: grpc.status.INTERNAL,
          message: error.message || "Failed to deduct stock",
        });
      }
    },
  });

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
      if (err) {
        console.error("Failed to bind gRPC server:", err);
        return;
      }
      console.log(`Inventory gRPC Server running at 0.0.0.0:${bindPort}`);
    }
  );
}

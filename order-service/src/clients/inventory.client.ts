import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.join(process.cwd(), "proto/inventory.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const inventoryProto = (grpc.loadPackageDefinition(packageDefinition) as any).inventory;

const GRPC_HOST = process.env.INVENTORY_GRPC_HOST || "inventory-service:50051";

export const inventoryClient = new inventoryProto.InventoryService(
  GRPC_HOST,
  grpc.credentials.createInsecure()
);

export function getProductFromInventory(id: string): Promise<{
  id: string;
  name: string;
  stock: number;
  amount: number;
  category: string;
}> {
  return new Promise((resolve, reject) => {
    inventoryClient.GetProduct({ id }, (err: any, response: any) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}

export function deductStockFromInventory(
  productId: string,
  quantity: number
): Promise<{ success: boolean; message: string; remainingStock: number }> {
  return new Promise((resolve, reject) => {
    inventoryClient.DeductStock({ productId, quantity }, (err: any, response: any) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}

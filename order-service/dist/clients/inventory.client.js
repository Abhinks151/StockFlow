"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryClient = void 0;
exports.getProductFromInventory = getProductFromInventory;
exports.deductStockFromInventory = deductStockFromInventory;
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const PROTO_PATH = path_1.default.join(process.cwd(), "proto/inventory.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const inventoryProto = grpc.loadPackageDefinition(packageDefinition).inventory;
const GRPC_HOST = process.env.INVENTORY_GRPC_HOST || "inventory-service:50051";
exports.inventoryClient = new inventoryProto.InventoryService(GRPC_HOST, grpc.credentials.createInsecure());
function getProductFromInventory(id) {
    return new Promise((resolve, reject) => {
        exports.inventoryClient.GetProduct({ id }, (err, response) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        });
    });
}
function deductStockFromInventory(productId, quantity) {
    return new Promise((resolve, reject) => {
        exports.inventoryClient.DeductStock({ productId, quantity }, (err, response) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        });
    });
}

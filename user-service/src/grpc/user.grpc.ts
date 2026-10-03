import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { UserService } from "../services/user.service";

const PROTO_PATH = path.join(process.cwd(), "proto/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = (grpc.loadPackageDefinition(packageDefinition) as any).user;
const userService = new UserService();

export function startGrpcServer(port: number = 50052) {
  const server = new grpc.Server();

  server.addService(userProto.UserService.service, {
    GetUser: async (call: any, callback: any) => {
      try {
        const userId = call.request.id;
        const user = await userService.getUserProfile(userId);

        callback(null, {
          id: (user as any)._id ? (user as any)._id.toString() : userId,
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error: any) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: error.message || "User not found",
        });
      }
    },
  });

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, bindPort: number) => {
      if (err) {
        console.error("Failed to bind User gRPC server:", err);
        return;
      }
      console.log(`User gRPC Server running at 0.0.0.0:${bindPort}`);
    }
  );
}

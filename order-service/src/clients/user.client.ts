import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.join(process.cwd(), "proto/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = (grpc.loadPackageDefinition(packageDefinition) as any).user;

const GRPC_HOST = process.env.USER_GRPC_HOST || "user-service:50052";

export const userClient = new userProto.UserService(
  GRPC_HOST,
  grpc.credentials.createInsecure()
);

export function getUserFromUserService(id: string): Promise<{
  id: string;
  name: string;
  email: string;
}> {
  return new Promise((resolve, reject) => {
    userClient.GetUser({ id }, (err: any, response: any) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}

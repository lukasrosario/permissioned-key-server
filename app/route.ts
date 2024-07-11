import { Hex, createClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { paymasterActionsEip7677 } from "permissionless/experimental";
import { entrypointAddress } from "@/app/abi/entrypoint";
import {
  ENTRYPOINT_ADDRESS_V06,
  UserOperation,
  createBundlerClient,
} from "permissionless";
import {
  handleFillUserOp,
  FillUserOpRequest,
} from "./fillUserOp/handleFillUserOp";
import { NextResponse } from "next/server";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const bundlerClient = createBundlerClient({
  chain: baseSepolia,
  transport: http(process.env.BUNDLER_URL),
  entryPoint: entrypointAddress,
});

export const paymasterEip7677Client = createClient({
  chain: baseSepolia,
  transport: http(process.env.PAYMASTER_URL),
}).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06));

type APIRequest =
  | FillUserOpRequest
  | {
      method: "wallet_sendUserOpWithSignature";
      params: {
        chainId: Hex;
        userOp: UserOperation<"v0.6">;
        signature: {
          authenticatorData: string;
          clientDataJSON: string;
          signature: string;
        };
      };
    };

export async function POST(r: Request) {
  const req = (await r.json()) as APIRequest;

  switch (req.method) {
    case "wallet_fillUserOp":
      return handleFillUserOp(req.params);
    case "wallet_sendUserOpWithSignature":
      return 1;
    default:
      return Response.json({ error: "Invalid method" }, { status: 400 });
  }
}

export async function OPTIONS(_request: Request) {
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });

  return response;
}

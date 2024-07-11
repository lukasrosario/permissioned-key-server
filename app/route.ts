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
      return Response.json({ message: "ok" });
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

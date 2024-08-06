import {
  handleFillUserOp,
  FillUserOpRequest,
} from "./fillUserOp/handleFillUserOp";
import { NextResponse } from "next/server";
import {
  SendUserOpWithSignatureRequest,
  handleSendUserOpWithSignature,
} from "./sendUserOpWithSignature/handleSendUserOpWIthSignature";
import {
  handleStorePermission,
  StorePermissionsRequest,
} from "./storePermission/handleStorePermission";
import {
  GetActivePermissionsRequest,
  handleGetActivePermissions,
} from "./getActivePermissions/handleGetActivePermissions";

type APIRequest =
  | FillUserOpRequest
  | SendUserOpWithSignatureRequest
  | StorePermissionsRequest
  | GetActivePermissionsRequest;

export async function POST(r: Request) {
  const req = (await r.json()) as APIRequest;

  switch (req.method) {
    case "wallet_fillUserOp":
      return handleFillUserOp(req.params);
    case "wallet_sendUserOpWithSignature":
      return handleSendUserOpWithSignature(req.params);
    case "wallet_storePermission":
      return handleStorePermission(req.params);
    case "wallet_getActivePermissions":
      return handleGetActivePermissions(req.params);
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

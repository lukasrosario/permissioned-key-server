import {
  handlePrepareCalls,
  PrepareCallsRequest,
} from "./prepareCalls/handlePrepareCalls";
import { NextResponse } from "next/server";
import { SendCallsRequest, handleSendCalls } from "./sendCalls/handleSendCalls";
import {
  handleStorePermission,
  StorePermissionsRequest,
} from "./storePermission/handleStorePermission";
import {
  GetActivePermissionsRequest,
  handleGetActivePermissions,
} from "./getActivePermissions/handleGetActivePermissions";

type APIRequest =
  | PrepareCallsRequest
  | SendCallsRequest
  | StorePermissionsRequest
  | GetActivePermissionsRequest;

export async function POST(r: Request) {
  const req = (await r.json()) as APIRequest;

  switch (req.method) {
    case "wallet_prepareCalls":
      return handlePrepareCalls(req.params);
    case "wallet_sendCalls":
      return handleSendCalls(req.params);
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

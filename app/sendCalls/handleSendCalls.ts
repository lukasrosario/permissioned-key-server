import { encodeAbiParameters } from "viem";
import { bundlerClient } from "../clients";
import { baseSepolia } from "viem/chains";
import { unhexlifyUserOp } from "./utils/unhexlifyUserOp";
import { cosignUserOp } from "../utils/cosignUserOp";
import { formatUserOpSignature } from "../utils/formatUserOpSignature";
import { decodePermissionContext } from "../utils/decodePermissionContext";
import { PrepareOrSendCallsParams } from "../types";

export type SendCallsRequest = {
  method: "wallet_sendCalls";
  params: PrepareOrSendCallsParams;
};

export async function handleSendCalls(request: PrepareOrSendCallsParams) {
  const { permissionManagerOwnerIndex, permission } = decodePermissionContext(
    request[0].capabilities.permissions.context,
  );

  const userOp = unhexlifyUserOp(
    request[0].capabilities.permissions.preparedCalls[0].values,
  );

  const cosignature = await cosignUserOp(userOp);

  const formattedSignature = formatUserOpSignature({
    userOp,
    userOpSignature:
      request[0].capabilities.permissions.preparedCalls[0].signature,
    userOpCosignature: cosignature,
    permissionManagerOwnerIndex,
    permission,
  });

  const userOpHash = await bundlerClient.sendUserOperation({
    userOperation: {
      ...userOp,
      signature: formattedSignature,
    },
  });

  const callsId = encodeAbiParameters(
    [
      { name: "userOpHash", type: "bytes32" },
      { name: "chainId", type: "uint256" },
    ],
    [userOpHash, BigInt(bundlerClient.chain?.id ?? baseSepolia.id)],
  );

  return Response.json({
    result: {
      callsId,
    },
  });
}

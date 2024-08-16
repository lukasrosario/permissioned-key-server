import { Hex, encodeAbiParameters } from "viem";
import { bundlerClient } from "../clients";
import { baseSepolia } from "viem/chains";
import {
  unhexlifyUserOp,
  UserOperationWithBigIntAsHex,
} from "./utils/unhexlifyUserOp";
import { cosignUserOp } from "../utils/cosignUserOp";
import { formatUserOpSignature } from "../utils/formatUserOpSignature";
import { decodePermissionContext } from "../utils/decodePermissionContext";

type SendUserOpWithSignatureParams = {
  chainId: Hex;
  userOp: UserOperationWithBigIntAsHex;
  permissionsContext: Hex;
  signature: Hex;
};

export type SendUserOpWithSignatureRequest = {
  method: "wallet_sendUserOpWithSignature";
  params: SendUserOpWithSignatureParams;
};

export async function handleSendUserOpWithSignature(
  request: SendUserOpWithSignatureParams,
) {
  const { permissionManagerOwnerIndex, permission } = decodePermissionContext(
    request.permissionsContext,
  );

  const userOp = unhexlifyUserOp(request.userOp);

  const cosignature = await cosignUserOp(userOp);

  const formattedSignature = formatUserOpSignature({
    userOp,
    userOpSignature: request.signature,
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

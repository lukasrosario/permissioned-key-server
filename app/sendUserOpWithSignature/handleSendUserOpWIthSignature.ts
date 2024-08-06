import { Hex, encodeAbiParameters } from "viem";
import { formatUserOpSignature } from "./utils/formatUserOpSignature";
import { bundlerClient } from "../clients";
import { decodePermissionContext } from "../fillUserOp/utils/decodePermissionsContext";
import { baseSepolia } from "viem/chains";
import { cosignUserOp } from "./utils/cosignUserOp";
import {
  unhexlifyUserOp,
  UserOperationWithBigIntAsHex,
} from "./utils/unhexlifyUserOp";

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
    permissionManagerOwnerIndex,
    permission,
    permissionSignerSignature: request.signature,
    cosignature,
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

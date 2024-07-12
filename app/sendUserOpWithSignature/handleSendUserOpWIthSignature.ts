import { Hex } from "viem";
import {
  UserOperationWithBigIntAsHex,
  updateUserOpSignature,
} from "./utils/userOp";
import { bundlerClient } from "../clients";
import { decodePermissionContext } from "../fillUserOp/utils/decodePermissionsContext";

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

  const updatedOp = updateUserOpSignature({
    userOp: request.userOp,
    permissionSignerSignature: request.signature,
    permissionManagerOwnerIndex,
    permission,
  });

  const userOpHash = await bundlerClient.sendUserOperation({
    userOperation: {
      ...updatedOp,
      // bigint-ify hexlified numbers for compiler
      nonce: BigInt(updatedOp.nonce),
      callGasLimit: BigInt(updatedOp.callGasLimit),
      verificationGasLimit: BigInt(updatedOp.verificationGasLimit),
      preVerificationGas: BigInt(updatedOp.preVerificationGas),
      maxFeePerGas: BigInt(updatedOp.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(updatedOp.maxPriorityFeePerGas),
    },
  });

  return Response.json({
    result: {
      callsId: userOpHash,
    },
  });
}

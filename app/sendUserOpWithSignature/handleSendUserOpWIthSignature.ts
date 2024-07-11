import { Address, Hex } from "viem";
import { getSignature } from "./utils/getSignature";
import {
  UserOperationWithBigIntAsHex,
  updateUserOpSignature,
} from "./utils/userOp";
import { bundlerClient } from "../clients";
import { UserOperation } from "permissionless";
import { decodePermissionContext } from "../fillUserOp/utils/decodePermissionsContext";

export type SignatureData = {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
};

type SendUserOpWithSignatureParams = {
  chainId: Hex;
  userOp: UserOperationWithBigIntAsHex;
  permissionsContext: Hex;
  signatureData: SignatureData;
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
  console.log(
    "decoded permissionManager ownerIndex",
    permissionManagerOwnerIndex,
  );
  console.log("decoded permission", permission);

  const updatedOp = updateUserOpSignature({
    userOp: request.userOp,
    permissionSignerSignature: getSignature(request.signatureData),
    permissionManagerOwnerIndex,
    permission,
  });
  console.log("updated userOp", updatedOp);

  const userOpHash = await bundlerClient.sendUserOperation({
    userOperation: {
      ...updatedOp,
      // bigint-ify hexlified numbers
      nonce: BigInt(updatedOp.nonce),
      callGasLimit: BigInt(updatedOp.callGasLimit),
      verificationGasLimit: BigInt(updatedOp.nonce),
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

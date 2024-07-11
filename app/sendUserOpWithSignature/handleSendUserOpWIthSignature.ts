import { Address, Hex } from "viem";
import { getSignature } from "./utils/getSignature";

type UserOperationWithBigIntAsHex = {
  sender: Address;
  nonce: Hex;
  initCode: Hex;
  callData: Hex;
  callGasLimit: Hex;
  verificationGasLimit: Hex;
  preVerificationGas: Hex;
  maxFeePerGas: Hex;
  maxPriorityFeePerGas: Hex;
  paymasterAndData: Hex;
  signature: Hex;
};

export type SignatureData = {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
};

type SendUserOpWithSignatureParams = {
  userOp: UserOperationWithBigIntAsHex;
  chainId: Hex;
  signature: SignatureData;
  permissionsContext: Hex;
};

export type SendUserOpWithSignatureRequest = {
  method: "wallet_sendUserOpWithSignature";
  params: SendUserOpWithSignatureParams;
};

export async function handleSendUserOpWithSignature(
  request: SendUserOpWithSignatureParams,
) {
  const signature = getSignature(request.signature, request.permissionsContext);

  //...
  // TODO
}

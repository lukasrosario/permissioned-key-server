import {
  Permission,
  permissionStruct,
} from "@/app/fillUserOp/utils/decodePermissionsContext";
import {
  Address,
  Hex,
  decodeAbiParameters,
  encodeAbiParameters,
  parseAbiParameter,
} from "viem";

/**
 *  wallet_sendCalls utils
 */

// note this is for v0.6, our current Entrypoint version for CoinbaseSmartWallet
export const userOperationStruct = parseAbiParameter([
  "UserOperation userOperation",
  "struct UserOperation { address sender; uint256 nonce; bytes initCode; bytes callData; uint256 callGasLimit; uint256 verificationGasLimit; uint256 preVerificationGas; uint256 maxFeePerGas; uint256 maxPriorityFeePerGas; bytes paymasterAndData; bytes signature; }",
]);

export type UserOperationWithBigIntAsHex = {
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

// returns a new UserOperation with the signature properly formatted for use with the PermissionManager
export function updateUserOpSignature({
  userOp,
  permissionManagerOwnerIndex,
  permission,
  permissionSignerSignature,
}: {
  userOp: UserOperationWithBigIntAsHex;
  permissionManagerOwnerIndex: bigint;
  permission: Permission;
  permissionSignerSignature: Hex;
}): UserOperationWithBigIntAsHex {
  const authData = encodeAbiParameters(
    [
      permissionStruct,
      { name: "permissionSignerSignature", type: "bytes" },
      userOperationStruct,
    ],
    [permission, permissionSignerSignature, userOp] as never,
  );
  const signature = wrapSignature({
    ownerIndex: permissionManagerOwnerIndex,
    signatureData: authData,
  });

  return {
    ...userOp,
    signature,
  };
}

/**
 *  shared, internal utils
 */

const signatureWrapperStruct = parseAbiParameter([
  "SignatureWrapper signatureWrapper",
  "struct SignatureWrapper { uint256 ownerIndex; bytes signatureData; }",
]);

// wraps a signature with an ownerIndex for verification within CoinbaseSmartWallet
function wrapSignature({
  ownerIndex,
  signatureData,
}: {
  ownerIndex: bigint;
  signatureData: Hex;
}): Hex {
  return encodeAbiParameters([signatureWrapperStruct], [
    { ownerIndex, signatureData },
  ] as never);
}

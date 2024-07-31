import {
  Permission,
  permissionStruct,
} from "@/app/fillUserOp/utils/decodePermissionsContext";
import { Hex, encodeAbiParameters, parseAbiParameter } from "viem";
import { UserOperation } from "permissionless";

// note this is for v0.6, our current Entrypoint version for CoinbaseSmartWallet
const userOperationStruct = parseAbiParameter([
  "UserOperation userOperation",
  "struct UserOperation { address sender; uint256 nonce; bytes initCode; bytes callData; uint256 callGasLimit; uint256 verificationGasLimit; uint256 preVerificationGas; uint256 maxFeePerGas; uint256 maxPriorityFeePerGas; bytes paymasterAndData; bytes signature; }",
]);

// returns a new UserOperation with the signature properly formatted for use with the PermissionManager
export function formatUserOpSignature({
  userOp,
  permissionManagerOwnerIndex,
  permission,
  permissionSignerSignature,
  cosignature,
}: {
  userOp: UserOperation<"v0.6">;
  permissionManagerOwnerIndex: bigint;
  permission: Permission;
  permissionSignerSignature: Hex;
  cosignature: Hex;
}): Hex {
  const authData = encodeAbiParameters(
    [
      permissionStruct,
      { name: "signature", type: "bytes" }, // permission signer
      { name: "cosignature", type: "bytes" }, // coinbase cosigner
      userOperationStruct,
    ],
    [permission, permissionSignerSignature, cosignature, userOp] as never,
  );
  const signature = wrapSignature({
    ownerIndex: permissionManagerOwnerIndex,
    signatureData: authData,
  });

  return signature;
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

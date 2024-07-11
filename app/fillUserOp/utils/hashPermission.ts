import { Hex, encodeAbiParameters, keccak256, parseAbiParameter } from "viem";
import { Permission } from "./decodePermissionsContext";

export const hashablePermissionStruct = parseAbiParameter([
  "HashablePermission hashablePermission",
  "struct HashablePermission { address account; uint256 chainId; uint40 expiry; bytes32 signerHash; address permissionContract; bytes32 permissionDataHash; address verifyingContract; }",
]);

export function hashPermission(permission: Permission): Hex {
  const { signer, permissionData, approval, ...hashablePermission } =
    permission;
  return keccak256(
    encodeAbiParameters(
      [hashablePermissionStruct],
      [
        {
          ...hashablePermission,
          signerHash: keccak256(signer),
          permissionDataHash: keccak256(permissionData),
        } as never,
      ],
    ),
  );
}

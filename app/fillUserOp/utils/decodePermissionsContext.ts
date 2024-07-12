import { Address, Hex, decodeAbiParameters, parseAbiParameter } from "viem";

export const permissionStruct = parseAbiParameter([
  "Permission permission",
  "struct Permission { address account; uint256 chainId; uint40 expiry; bytes signer; address permissionContract; bytes permissionData; address verifyingContract; bytes approval; }",
]);

export type Permission = {
  account: Address;
  chainId: bigint;
  expiry: number; // unix seconds
  signer: Hex; // ethereum address or passkey public key
  permissionContract: Address;
  permissionData: Hex;
  verifyingContract: Address;
  approval: Hex;
};

export function decodePermissionContext(permissionContext: Hex): {
  permissionManagerOwnerIndex: bigint;
  permission: Permission;
} {
  const [permissionManagerOwnerIndex, permission] = decodeAbiParameters(
    [
      { name: "permissionManagerOwnerIndex", type: "uint256" },
      permissionStruct,
    ],
    permissionContext,
  );
  return { permissionManagerOwnerIndex, permission };
}

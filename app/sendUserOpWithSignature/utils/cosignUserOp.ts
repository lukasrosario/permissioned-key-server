import { privateKeyToAccount } from "viem/accounts";
import { Hex } from "viem";
import {
  ENTRYPOINT_ADDRESS_V06,
  getUserOperationHash,
  UserOperation,
} from "permissionless";
import { baseSepolia } from "viem/chains";

const cosignerAccount = privateKeyToAccount(
  process.env.COSIGNER_PRIVATE_KEY as Hex,
);

export async function cosignUserOp(userOperation: UserOperation<"v0.6">) {
  const userOpHash = getUserOperationHash({
    userOperation,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chainId: baseSepolia.id,
  });

  const rejectCosign = false; // TODO: add dynamic logic to reject cosigning

  if (rejectCosign) {
    throw Error("Cosigning rejected.");
  }

  // raw `sign` does not pad EIP-191 hash, required for working with SmartWallet
  const cosignature = await cosignerAccount.sign({
    hash: userOpHash,
  });

  return cosignature;
}

import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, Hex } from "viem";
import {
  ENTRYPOINT_ADDRESS_V06,
  getUserOperationHash,
  UserOperation,
} from "permissionless";
import { baseSepolia } from "viem/chains";

const cosignerWalletClient = createWalletClient({
  transport: http("https://sepolia.base.org"),
  account: privateKeyToAccount(process.env.COSIGNER_PRIVATE_KEY as Hex),
});

export async function cosignUserOp(userOperation: UserOperation<"v0.6">) {
  const userOpHash = getUserOperationHash({
    userOperation,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chainId: baseSepolia.id,
  });

  const rejectCosign = false;

  if (rejectCosign) {
    throw Error("Cosigning rejected.");
  }

  // pretty sure this will NOT work because of forced EIP-191 prefixing on viem's default `signMessage`
  // should look into their latest utils just for userOps
  const cosignature = await cosignerWalletClient.signMessage({
    message: { raw: userOpHash },
  });

  return cosignature;
}

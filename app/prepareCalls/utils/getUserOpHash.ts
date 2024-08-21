import { entrypointAbi, entrypointAddress } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/clients";
import { UserOperation } from "permissionless";
import { Hex } from "viem";

export async function getUserOpHash(
  userOp: UserOperation<"v0.6">,
): Promise<{ hash: Hex }> {
  const hash = await publicClient.readContract({
    address: entrypointAddress,
    abi: entrypointAbi,
    functionName: "getUserOpHash",
    args: [userOp],
  });
  return { hash };
}

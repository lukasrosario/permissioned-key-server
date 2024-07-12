import { entrypointAbi, entrypointAddress } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/clients";
import { base64urlnopad } from "@scure/base";
import { UserOperation } from "permissionless";
import { Hex, hexToBytes } from "viem";

export async function getUserOpHash(
  userOp: UserOperation<"v0.6">,
): Promise<{ hash: Hex; base64Hash: string }> {
  const hash = await publicClient.readContract({
    address: entrypointAddress,
    abi: entrypointAbi,
    functionName: "getUserOpHash",
    args: [userOp],
  });
  return { hash, base64Hash: base64urlnopad.encode(hexToBytes(hash)) };
}

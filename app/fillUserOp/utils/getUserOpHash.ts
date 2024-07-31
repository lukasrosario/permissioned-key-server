import { entrypointAbi } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/clients";
import { base64urlnopad } from "@scure/base";
import { ENTRYPOINT_ADDRESS_V06, UserOperation } from "permissionless";
import { Hex, hexToBytes } from "viem";

export async function getUserOpHash(
  userOp: UserOperation<"v0.6">,
): Promise<{ hash: Hex; base64Hash: string }> {
  const hash = await publicClient.readContract({
    address: ENTRYPOINT_ADDRESS_V06,
    abi: entrypointAbi,
    functionName: "getUserOpHash",
    args: [userOp],
  });
  return { hash, base64Hash: base64urlnopad.encode(hexToBytes(hash)) };
}

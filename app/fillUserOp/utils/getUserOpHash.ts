import { entrypointAbi, entrypointAddress } from "@/app/abi/entrypoint";
import { base64urlnopad } from "@scure/base";
import { UserOperation } from "permissionless";
import { hexToBytes } from "viem";
import { publicClient } from "../../route";

export async function getUserOpHash(
  userOp: UserOperation<"v0.6">,
): Promise<string> {
  const hash = await publicClient.readContract({
    address: entrypointAddress,
    abi: entrypointAbi,
    functionName: "getUserOpHash",
    args: [userOp],
  });
  return base64urlnopad.encode(hexToBytes(hash));
}

import { entrypointAbi } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/clients";
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { Address } from "viem";

export function getNonce(address: Address): Promise<bigint> {
  return publicClient.readContract({
    address: ENTRYPOINT_ADDRESS_V06,
    abi: entrypointAbi,
    functionName: "getNonce",
    args: [address, BigInt(0)],
  });
}

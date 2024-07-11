import { entrypointAbi, entrypointAddress } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/route";
import { Address } from "viem";

export function getNonce(address: Address): Promise<bigint> {
  return publicClient.readContract({
    address: entrypointAddress,
    abi: entrypointAbi,
    functionName: "getNonce",
    args: [address, BigInt(0)],
  });
}

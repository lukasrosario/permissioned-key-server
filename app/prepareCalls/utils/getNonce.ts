import { entrypointAbi, entrypointAddress } from "@/app/abi/entrypoint";
import { publicClient } from "@/app/clients";
import { Address } from "viem";

const MIN_NONCE_KEY = 69;
const MAX_NONCE_KEY = 420;

export function getNonce(address: Address): Promise<bigint> {
  const nonceKey = Math.floor(Math.random() * MAX_NONCE_KEY) + MIN_NONCE_KEY;

  return publicClient.readContract({
    address: entrypointAddress,
    abi: entrypointAbi,
    functionName: "getNonce",
    args: [address, BigInt(nonceKey)],
  });
}

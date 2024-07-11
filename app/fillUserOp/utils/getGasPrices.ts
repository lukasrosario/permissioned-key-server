import { publicClient } from "@/app/route";

type GasPrices = {
  maxPriorityFeePerGas: bigint;
  maxFeePerGas: bigint;
};

export async function getGasPrices(): Promise<GasPrices> {
  const baseFee = BigInt(
    Math.floor(Number(await publicClient.getGasPrice()) * 1.25),
  );
  const maxPriorityFeePerGas = BigInt(
    Math.floor(
      Number(await publicClient.estimateMaxPriorityFeePerGas()) * 1.25,
    ),
  );
  const maxFeePerGas = baseFee + maxPriorityFeePerGas;

  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
}

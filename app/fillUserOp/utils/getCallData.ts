import { Address, Hex, encodeFunctionData, hexToBigInt } from "viem";
import { Call } from "../handleFillUserOp";
import { smartWalletAbi } from "@/app/abi/smartWallet";

export function getCallData(calls: Call[]): Hex {
  return encodeFunctionData({
    abi: smartWalletAbi,
    functionName: "executeBatch",
    args: [
      calls.map((call) => ({
        target: call.to as Address,
        data: call.data ?? "0x",
        value: hexToBigInt(call.value ?? "0x0"),
      })),
    ],
  });
}

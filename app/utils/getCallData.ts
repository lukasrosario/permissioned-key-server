import {
  Address,
  Hex,
  encodeFunctionData,
  hexToBigInt,
  isAddressEqual,
  zeroAddress,
} from "viem";
import { smartWalletAbi } from "@/app/abi/smartWallet";
import { preparePermissionedCall } from "@/app/utils/preparePermissionedCall";
import { decodePermissionContext } from "@/app/utils/decodePermissionContext";
import { prepareAssertSpend } from "@/app/utils/prepareAssertSpend";
import { Call } from "@/app/types";
import { prepareCheckBeforeCalls } from "@/app/utils/prepareCheckBeforeCalls";
import { cosignerAccount } from "@/app/utils/cosignUserOp";
import { NativeTokenRollingSpendLimitPermission } from "../constants";

export async function getCallData(
  calls: Call[],
  permissionsContext?: Hex,
  gasSpend?: bigint, // omit on first pass and then come back
  paymaster?: Address,
): Promise<Hex> {
  if (!permissionsContext) {
    return encodeCallData(calls);
  }

  const { permission } = decodePermissionContext(permissionsContext);
  if (
    isAddressEqual(
      permission.permissionContract,
      NativeTokenRollingSpendLimitPermission,
    )
  ) {
    const checkBeforeCalls = prepareCheckBeforeCalls({
      permission,
      paymaster: paymaster ?? zeroAddress,
      cosigner: cosignerAccount.address,
    });

    const permissionedCalls = calls.map((call) =>
      preparePermissionedCall(call),
    );

    // accumulate attempted spend from calls and insert new call to registerSpend
    const callsSpend = calls.reduce(
      (acc, call) => acc + hexToBigInt(call.value ?? "0x0"),
      BigInt(0),
    );

    const assertSpendCall = await prepareAssertSpend({
      permission,
      callsSpend,
      gasSpend: gasSpend ?? BigInt(0),
      paymaster: paymaster ?? zeroAddress,
    });

    calls = [checkBeforeCalls, ...permissionedCalls, assertSpendCall];
  }

  return encodeCallData(calls);
}

function encodeCallData(calls: Call[]): Hex {
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

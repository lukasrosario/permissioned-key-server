import {
  Address,
  Hex,
  decodeAbiParameters,
  encodeFunctionData,
  hexToBigInt,
  isAddressEqual,
  zeroAddress,
} from "viem";
import { smartWalletAbi } from "@/app/abi/smartWallet";
import { buildAssertSpendCall } from "./buildAssertSpendCall";
import { hashPermission } from "./hashPermission";
import { permissionCallableAbi } from "@/app/abi/permissionCallable";
import { preparePermissionedCall } from "@/app/utils/preparePermissionedCall";
import { decodePermissionContext } from "@/app/utils/decodePermissionContext";
import { prepareAssertSpend } from "@/app/utils/prepareAssertSpend";
import { Call } from "@/app/types";
import { prepareCheckBeforeCalls } from "@/app/utils/prepareCheckBeforeCalls";
import { cosignerAccount } from "@/app/utils/cosignUserOp";

export const CallWithPermission = "0x245e88921605b20338456529956a30b795636a55";

export async function getCallData(
  calls: Call[],
  permissionsContext?: Hex,
  gasSpend?: bigint, // omit on first pass and then come back
): Promise<Hex> {
  if (!permissionsContext) {
    return encodeCallData(calls);
  }
  let newCalls: Call;
  const { permission } = decodePermissionContext(permissionsContext);
  if (isAddressEqual(permission.permissionContract, CallWithPermission)) {
    const checkBeforeCalls = prepareCheckBeforeCalls({
      permission,
      paymaster: zeroAddress,
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
      paymaster: zeroAddress,
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

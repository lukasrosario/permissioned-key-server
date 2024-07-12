import {
  Address,
  Hex,
  decodeAbiParameters,
  encodeFunctionData,
  hexToBigInt,
  isAddressEqual,
} from "viem";
import { Call } from "../handleFillUserOp";
import { smartWalletAbi } from "@/app/abi/smartWallet";
import { buildAssertSpendCall } from "./buildAssertSpendCall";
import {
  Permission,
  decodePermissionContext,
} from "./decodePermissionsContext";
import { hashPermission } from "./hashPermission";
import { permissionCallableAbi } from "@/app/abi/permissionCallable";

export const CallWithPermission = "0x245e88921605b20338456529956a30b795636a55";

export async function getCallData(
  calls: Call[],
  permissionsContext?: Hex,
): Promise<Hex> {
  if (!permissionsContext) {
    return encodeCallData(calls);
  }

  const { permission } = decodePermissionContext(permissionsContext);
  if (isAddressEqual(permission.permissionContract, CallWithPermission)) {
    calls = calls.map((call) => ({
      ...call,
      data: wrapCallDataWithPermission(call, permission),
    }));

    // accumulate attempted spend from calls and insert new call to registerSpend
    const attemptedSpend = calls.reduce(
      (acc, call) => acc + hexToBigInt(call.value ?? "0x0"),
      BigInt(0),
    );

    if (attemptedSpend > BigInt(0)) {
      const assertSpendCall = await buildAssertSpendCall(
        attemptedSpend,
        permissionsContext,
      );
      calls = [...calls, assertSpendCall];
    }
  }

  return encodeCallData(calls);
}

function wrapCallDataWithPermission(call: Call, permission: Permission) {
  const { permissionArgs } = decodeCallWithPermissionData(
    permission.permissionData,
  );

  return encodeFunctionData({
    abi: permissionCallableAbi,
    functionName: "callWithPermission",
    args: [hashPermission(permission), permissionArgs, call.data],
  });
}

function decodeCallWithPermissionData(permissionData: Hex) {
  const [allowance, allowedContract, permissionArgs] = decodeAbiParameters(
    [
      { name: "allowance", type: "uint256" },
      { name: "allowedContract", type: "address" },
      { name: "permissionArgs", type: "bytes" },
    ],
    permissionData,
  );
  return {
    allowance,
    allowedContract,
    permissionArgs,
  };
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

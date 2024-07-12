import { Address, Hex, encodeFunctionData } from "viem";
import { Call } from "../handleFillUserOp";
import { decodePermissionContext } from "./decodePermissionsContext";
import { hashPermission } from "./hashPermission";
import { publicClient } from "@/app/clients";
import { callWithPermissionAbi } from "@/app/abi/callWithPermission";

export async function buildAssertSpendCall(
  attemptedSpend: bigint,
  permisisonsContext: Hex,
): Promise<Call> {
  const { permission } = decodePermissionContext(permisisonsContext);
  const balance = await publicClient.getBalance({
    address: permission.account,
  });
  const assertSpendCall = {
    to: permission.permissionContract as Address,
    value: "0x0" as Hex,
    data: encodeFunctionData({
      abi: callWithPermissionAbi,
      functionName: "assertSpend",
      args: [
        balance - attemptedSpend, // enforce balance only decreases by accounted attempted spend for reentrancy protection
        hashPermission(permission),
        attemptedSpend,
      ],
    }),
  };
  return assertSpendCall;
}

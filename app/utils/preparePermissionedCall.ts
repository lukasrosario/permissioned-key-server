import { encodeFunctionData, Hex } from "viem";

import { Call } from "../types";
import { permissionCallableAbi } from "../abi/PermissionCallable";

export function preparePermissionedCall(call: Call) {
  const permissionedCall = {
    to: call.to,
    value: call.value,
    data: encodeFunctionData({
      abi: permissionCallableAbi,
      functionName: "permissionedCall",
      args: [call.data],
    }),
  };
  return permissionedCall;
}

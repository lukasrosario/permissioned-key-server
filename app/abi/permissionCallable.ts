export const permissionCallableAbi = [
  {
    type: "function",
    name: "callWithPermission",
    inputs: [
      { name: "permissionHash", type: "bytes32", internalType: "bytes32" },
      { name: "permissionData", type: "bytes", internalType: "bytes" },
      { name: "call", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "result", type: "bytes", internalType: "bytes" }],
    stateMutability: "payable",
  },
] as const;

export const callWithPermissionAbi = [
  { inputs: [], name: "ExceededSpendingLimit", type: "error" },
  { inputs: [], name: "FailedBalanceAssertion", type: "error" },
  { inputs: [], name: "InvalidUserOperationCallData", type: "error" },
  { inputs: [], name: "InvalidUserOperationHash", type: "error" },
  { inputs: [], name: "InvalidUserOperationSender", type: "error" },
  { inputs: [], name: "MissingAssertSpend", type: "error" },
  { inputs: [], name: "SelectorNotAllowed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "permissionHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SpendRegistered",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "assertBalance", type: "uint256" },
      { internalType: "bytes32", name: "permissionHash", type: "bytes32" },
      { internalType: "uint256", name: "spendValue", type: "uint256" },
    ],
    name: "assertSpend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "permissionHash", type: "bytes32" },
      { internalType: "bytes", name: "permissionData", type: "bytes" },
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "bytes", name: "initCode", type: "bytes" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "callGasLimit", type: "uint256" },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          { internalType: "uint256", name: "maxFeePerGas", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation",
        name: "userOp",
        type: "tuple",
      },
    ],
    name: "validatePermission",
    outputs: [
      { internalType: "uint256", name: "validationData", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

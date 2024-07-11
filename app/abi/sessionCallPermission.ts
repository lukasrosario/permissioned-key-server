export const sessionCallPermissionAbi = [
  { inputs: [], name: "FailedBalanceAssertion", type: "error" },
  { inputs: [], name: "InvalidUserOperationCallData", type: "error" },
  { inputs: [], name: "InvalidUserOperationHash", type: "error" },
  { inputs: [], name: "InvalidUserOperationSender", type: "error" },
  { inputs: [], name: "MissingAssertSpend", type: "error" },
  { inputs: [], name: "SelectorNotAllowed", type: "error" },
  { inputs: [], name: "SpendingLimitExceeded", type: "error" },
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
        name: "sessionHash",
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
      { internalType: "bytes32", name: "sessionHash", type: "bytes32" },
      { internalType: "uint256", name: "spendValue", type: "uint256" },
    ],
    name: "assertSpend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "hash", type: "bytes32" },
      { internalType: "bytes32", name: "sessionHash", type: "bytes32" },
      { internalType: "bytes", name: "permissionData", type: "bytes" },
      { internalType: "bytes", name: "requestData", type: "bytes" },
    ],
    name: "validatePermission",
    outputs: [
      { internalType: "uint256", name: "validationData", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

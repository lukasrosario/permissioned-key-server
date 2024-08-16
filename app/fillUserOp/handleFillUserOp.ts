import { Address, Hex, slice, zeroAddress } from "viem";
import { getNonce } from "./utils/getNonce";
import { getGasPrices } from "./utils/getGasPrices";
import { UserOperation, deepHexlify } from "permissionless";
import { getUserOpHash } from "./utils/getUserOpHash";
import { bundlerClient, paymasterEip7677Client } from "../clients";
import { baseSepolia } from "viem/chains";
import { Call } from "../types";
import { getRequiredPrefund } from "../utils/getRequiresPrefund";
import { getCallData } from "../utils/getCallData";
import { decodePermissionContext } from "../utils/decodePermissionContext";

const DUMMY_SIGNATURE =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001949fc7c88032b9fcb5f6efc7a7b8c63668eae9871b765e23123bb473ff57aa831a7c0d9276168ebcc29f2875a0239cffdf2a9cd1c2007c5c77c071db9264df1d000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2273496a396e6164474850596759334b7156384f7a4a666c726275504b474f716d59576f4d57516869467773222c226f726967696e223a2268747470733a2f2f7369676e2e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000";

type FillUserOpParams = {
  from: Address;
  chainId: Hex;
  calls: Call[];
  capabilities: {
    paymasterService: { url: string };
    permissions?: { context: Hex };
  };
}[];

export type FillUserOpRequest = {
  method: "wallet_fillUserOp";
  params: FillUserOpParams;
};

export async function handleFillUserOp(request: FillUserOpParams) {
  console.log("handleFillUserOp");

  const { calls, capabilities, from } = request[0];

  const nonce = await getNonce(from);

  const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrices();

  let userOpToSign: UserOperation<"v0.6"> = {
    sender: from,
    nonce,
    maxFeePerGas: maxFeePerGas * BigInt(2),
    maxPriorityFeePerGas: maxPriorityFeePerGas * BigInt(2),
    callData: "0x",
    initCode: "0x",
    paymasterAndData: "0x",
    preVerificationGas: BigInt(0),
    callGasLimit: BigInt(0),
    verificationGasLimit: BigInt(0),
    signature: DUMMY_SIGNATURE,
  };
  const initialGasSpend = getRequiredPrefund(userOpToSign);
  const initialCallData = await getCallData(
    calls,
    capabilities.permissions?.context,
    initialGasSpend,
  );

  userOpToSign = {
    ...userOpToSign,
    callData: initialCallData,
  };

  const paymasterStubData = await paymasterEip7677Client.getPaymasterStubData({
    userOperation: userOpToSign,
    context: {},
    chain: baseSepolia,
  });

  const paymaster = slice(paymasterStubData.paymasterAndData, 0, 20);
  const initialCallData2 = await getCallData(
    calls,
    capabilities.permissions?.context,
    initialGasSpend,
    paymaster,
  );

  userOpToSign = {
    ...userOpToSign,
    callData: initialCallData2,
    paymasterAndData: paymasterStubData.paymasterAndData,
  };

  const gasEstimates = await bundlerClient.estimateUserOperationGas({
    userOperation: userOpToSign,
  });

  userOpToSign = {
    ...userOpToSign,
    callGasLimit: gasEstimates.callGasLimit * BigInt(10),
    verificationGasLimit: gasEstimates.verificationGasLimit * BigInt(10),
    preVerificationGas: gasEstimates.preVerificationGas * BigInt(10),
  };

  const gasSpend = getRequiredPrefund(userOpToSign);
  const finalCallData = await getCallData(
    calls,
    capabilities.permissions?.context,
    gasSpend,
    paymaster,
  );

  userOpToSign = {
    ...userOpToSign,
    callData: finalCallData,
  };

  const paymasterData = await paymasterEip7677Client.getPaymasterData({
    userOperation: userOpToSign,
    context: {},
  });

  userOpToSign = {
    ...userOpToSign,
    paymasterAndData: paymasterData.paymasterAndData,
  };

  const { hash, base64Hash } = await getUserOpHash(userOpToSign);

  return Response.json({
    result: {
      userOp: deepHexlify({ ...userOpToSign, signature: "0x" }),
      hash,
      base64Hash,
    },
  });
}

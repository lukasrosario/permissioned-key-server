import { createBundlerClient, ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { paymasterActionsEip7677 } from "permissionless/experimental";
import { createPublicClient, http, createClient } from "viem";
import { baseSepolia } from "viem/chains";
import { entrypointAddress } from "./abi/entrypoint";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const bundlerClient = createBundlerClient({
  chain: baseSepolia,
  transport: http(process.env.BUNDLER_URL),
  entryPoint: entrypointAddress,
});

export const paymasterEip7677Client = createClient({
  chain: baseSepolia,
  transport: http(process.env.PAYMASTER_URL),
}).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06));

import { Address, checksumAddress, Hex } from "viem";
import { sql } from "@vercel/postgres";

type GetActivePermissionsParams = {
  address: Address;
  signer: Hex;
};

export type GetActivePermissionsRequest = {
  method: "wallet_getActivePermissions";
  params: GetActivePermissionsParams;
};

export async function handleGetActivePermissions(
  request: GetActivePermissionsParams,
) {
  const { rows } =
    await sql`SELECT * FROM Permissions WHERE Address = ${checksumAddress(request.address)} AND Signer = ${request.signer};`;

  return Response.json({
    result: rows.map(({ permission }) => permission),
  });
}

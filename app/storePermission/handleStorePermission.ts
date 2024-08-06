import { Address, checksumAddress, Hex } from "viem";
import { sql } from "@vercel/postgres";

type StorePermissionParams = {
  address: Address;
  signer: Hex;
  permissions: any[];
};

export type StorePermissionsRequest = {
  method: "wallet_storePermission";
  params: StorePermissionParams;
};

export async function handleStorePermission(request: StorePermissionParams) {
  await sql`CREATE TABLE IF NOT EXISTS Permissions ( Address char(42), Signer varchar(255), Permission json );`;

  await sql`INSERT INTO Permissions (Address, Signer, Permission) VALUES (${checksumAddress(request.address)}, ${request.signer}, ${JSON.stringify(request.permissions)});`;

  return Response.json({
    result: "Ok",
  });
}

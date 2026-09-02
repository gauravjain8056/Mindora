import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
let accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
let accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
export const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "mindora-files";

let blobServiceClient;

if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  // Extract account name and key from connection string if not explicitly set
  if (!accountName) {
    const matchName = connectionString.match(/AccountName=([^;]+)/i);
    if (matchName) accountName = matchName[1];
  }
  if (!accountKey) {
    const matchKey = connectionString.match(/AccountKey=([^;]+)/i);
    if (matchKey) accountKey = matchKey[1];
  }
} else if (accountName && accountKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
} else {
  console.warn("Warning: Azure Blob Storage credentials (AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME + AZURE_STORAGE_ACCOUNT_KEY) are not configured.");
  // Initialize with dummy endpoint to avoid startup crash in local dev without env
  blobServiceClient = new BlobServiceClient("https://placeholder.blob.core.windows.net");
}

export const sharedKeyCredential = (accountName && accountKey)
  ? new StorageSharedKeyCredential(accountName, accountKey)
  : null;

export { accountName, accountKey };
export const containerClient = blobServiceClient.getContainerClient(containerName);
export default blobServiceClient;

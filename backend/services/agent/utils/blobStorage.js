import {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import {
  containerClient,
  sharedKeyCredential,
  containerName,
} from "../config/blobStorage.js";

let containerEnsured = false;

async function ensureContainer() {
  if (!containerEnsured) {
    try {
      await containerClient.createIfNotExists();
      containerEnsured = true;
    } catch (error) {
      // If already exists or insufficient permission to create, proceed
      containerEnsured = true;
    }
  }
}

/**
 * Uploads a file buffer to Azure Blob Storage
 * @param {string} filename - Target filename in the container
 * @param {Buffer} buffer - File binary buffer
 * @param {string} contentType - MIME content type
 * @returns {Promise<string>} Uploaded filename
 */
export const uploadToBlob = async (filename, buffer, contentType) => {
  await ensureContainer();
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  });
  return filename;
};

/**
 * Generates a temporary secure SAS download URL for a blob in Azure Blob Storage
 * @param {string} filename - Blob filename
 * @param {number} expiresIn - Expiration time in seconds (default 600 = 10 minutes)
 * @returns {Promise<string>} Full download URL with SAS token
 */
export const getBlobUrl = async (filename, expiresIn = 600) => {
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  if (sharedKeyCredential) {
    const startsOn = new Date(Date.now() - 5 * 60 * 1000); // 5-min clock-skew buffer
    const expiresOn = new Date(Date.now() + expiresIn * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: filename,
        permissions: BlobSASPermissions.parse("r"),
        startsOn,
        expiresOn,
      },
      sharedKeyCredential
    ).toString();

    return `${blockBlobClient.url}?${sasToken}`;
  }

  return blockBlobClient.url;
};

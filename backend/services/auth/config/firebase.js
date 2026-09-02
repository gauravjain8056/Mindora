import { cert, initializeApp, getApps } from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT_JSON === "string"
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", error.message);
  }
}

if (!serviceAccount) {
  const localKeyPath = path.resolve(__dirname, "../serviceAccountKey.json");
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileData = fs.readFileSync(localKeyPath, "utf-8");
      serviceAccount = JSON.parse(fileData);
    } catch (error) {
      console.error("Failed to read local serviceAccountKey.json:", error.message);
    }
  }
}

export const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount)
    })
  : getApps()[0];
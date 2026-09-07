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
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
    if (raw.startsWith("{")) {
      serviceAccount = JSON.parse(raw);
    } else {
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      serviceAccount = JSON.parse(decoded);
    }
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", error.message);
  }
}

if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  };
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
  ? (serviceAccount ? initializeApp({ credential: cert(serviceAccount) }) : initializeApp())
  : getApps()[0];

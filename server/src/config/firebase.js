import admin from "firebase-admin";
import { envConfig } from "./env.config.js";

// Handle newline characters in private key (Common issue with .env files)
const privateKey = envConfig.firebase.privateKey 
  ? envConfig.firebase.privateKey.replace(/\\n/g, '\n') 
  : undefined;

const serviceAccount = {
  projectId: envConfig.firebase.projectId,
  clientEmail: envConfig.firebase.clientEmail,
  privateKey: privateKey,
};

// Prevent multiple initializations (Singleton pattern)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default admin;
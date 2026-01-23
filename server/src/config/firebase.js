// server/src/config/firebase.js
import admin from "firebase-admin";
import { envConfig } from "./env.config.js";

// Handle newline characters in private key specifically for some hosting providers
const privateKey = envConfig.firebase.privateKey 
  ? envConfig.firebase.privateKey.replace(/\\n/g, '\n') 
  : undefined;

const serviceAccount = {
  projectId: envConfig.firebase.projectId,
  clientEmail: envConfig.firebase.clientEmail,
  privateKey: privateKey,
};

// Prevent multiple initializations
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default admin;
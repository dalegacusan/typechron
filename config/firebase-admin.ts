const admin = require("firebase-admin");
import { FromBase64 } from "../utils/base64";

if (!admin.apps.length) {
  admin.initializeApp({
    // @ref https://stackoverflow.com/a/48834975/12278028
    credential: admin.credential.cert(
      JSON.parse(
        FromBase64(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY as string)
      )
    ),
  });
}

export const VerifyIdToken = async (token: string) => {
  try {
    return admin.auth().verifyIdToken(token);
  } catch (err) {
    return null;
  }
};

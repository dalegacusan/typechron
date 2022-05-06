const admin = require("firebase-admin");
const serviceAccount = require("../firebaseAdminServiceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const VerifyIdToken = async (token: string) => {
  let isValidToken;

  try {
    await admin.auth().verifyIdToken(token);

    isValidToken = true;
  } catch (err) {
    isValidToken = false;
  }

  return isValidToken;
};

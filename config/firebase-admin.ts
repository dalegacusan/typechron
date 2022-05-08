const admin = require("firebase-admin");
const serviceAccount = require(`../typechron-service-account-key.prod.json`);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const VerifyIdToken = async (token: string) => {
  try {
    return admin.auth().verifyIdToken(token);
  } catch (err) {
    return null;
  }
};

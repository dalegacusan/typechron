import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase-app";
import { CREATE_USER, QUERY_USER } from "../utils/http";
import { ApiResultCode } from "../enums/api/api-result-code.enum";

export interface FormattedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  username?: string | null;
  photoUrl: string | null;
}

const formatAuthUser = (user: User): FormattedUser => {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
  };
};

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<FormattedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resetState = () => {
    setAuthUser(null);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(firebaseAuth, provider);
    const loggedInUser = res.user;

    if (loggedInUser) {
      const { user, resultInfo: qResultInfo } = await QUERY_USER(
        loggedInUser.uid
      );

      if (qResultInfo.resultCode !== ApiResultCode.REQ_SUCCESS) {
        signOut();

        return { code: qResultInfo.resultCode };
      }

      if (!user) {
        const { user: newUser, resultInfo: cResultInfo } = await CREATE_USER(
          loggedInUser.uid,
          loggedInUser.email as string
        );

        if (cResultInfo.resultCode !== ApiResultCode.REQ_SUCCESS) {
          signOut();

          return { code: qResultInfo.resultCode };
        }

        // @ts-ignore
        setAuthUser((prev) => ({
          ...prev,
          username: newUser?.username as string,
        }));
      }
    }

    return res;
  };

  const signOut = () => getAuth().signOut().then(resetState);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      resetState();

      return;
    }

    setLoading(true);

    const formattedUser = formatAuthUser(authState);

    // Query user to get username
    const { user, resultInfo: qResultInfo } = await QUERY_USER(
      formattedUser.uid
    );

    if (qResultInfo.resultCode !== ApiResultCode.REQ_SUCCESS) {
      resetState();

      return;
    }

    setAuthUser((prev) => ({
      ...formattedUser,
      username: user?.username as string,
    }));
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(authStateChanged);

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}

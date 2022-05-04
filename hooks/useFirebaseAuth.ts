import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase-app";
import { CREATE_USER, QUERY_USER } from "../utils/http";
import { ApiResultCode } from "../utils/api/enums/api-result-code.enum";

export interface FormattedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  username?: string | null;
  photoUrl: string | null;
  dateCreated?: number;
  highestScoringGame?: {
    gameId: string;
    round: number;
    score: number;
    wpm: number;
    words: string[];
    dateCreated: number;
  };
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
  const [loading, setLoading] = useState<boolean>(true);

  const resetState = () => {
    setAuthUser(null);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    // Need to handle "FirebaseError: Firebase: Error (auth/popup-closed-by-user)."
    // This error happens when closing the sign in pop-up
    try {
      return signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      return { code: null, message: null };
    }
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
    const { user } = await QUERY_USER(formattedUser.uid);

    if (!user) {
      const { user: newUser, resultInfo: cResultInfo } = await CREATE_USER(
        formattedUser.uid,
        formattedUser.email as string
      );

      if (cResultInfo.resultCode !== ApiResultCode.REQ_SUCCESS) {
        signOut();

        return;
      }

      // @ts-ignore
      setAuthUser((prev) => {
        return {
          ...formattedUser,
          username: newUser?.username as string,
          dateCreated: newUser?.dateCreated as number,
          highestScoringGame: newUser?.highestScoringGame,
        };
      });
    } else {
      // @ts-ignore
      setAuthUser((prev) => ({
        ...formattedUser,
        username: user?.username as string,
        dateCreated: user?.dateCreated as number,
        highestScoringGame: user?.highestScoringGame,
      }));
    }

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

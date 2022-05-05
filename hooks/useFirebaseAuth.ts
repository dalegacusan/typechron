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
import { ApiResultStatus } from "../utils/api/enums/api-result-status.enum";

export interface FormattedUser {
  idToken?: string;
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

    const userIdToken = await authState.getIdToken();

    const formattedUser = formatAuthUser(authState);

    // Query user to get username
    const { user, resultInfo } = await QUERY_USER(
      userIdToken,
      formattedUser.uid
    );

    if (resultInfo.resultStatus === ApiResultStatus.SUCCESS) {
      // @ts-ignore
      setAuthUser((prev) => ({
        ...formattedUser,
        idToken: userIdToken,
        username: user?.username as string,
        dateCreated: user?.dateCreated as number,
        highestScoringGame: user?.highestScoringGame,
      }));
    } else {
      // A new user can only be created if a user does not exist.
      // If the API error response is different from USER_NOT_FOUND,
      // it could be possible be because of ex. Invalid Request Parameters
      if (resultInfo.resultCode !== ApiResultCode.USER_NOT_FOUND) {
        signOut();

        return;
      } else {
        const { user: newUser, resultInfo: cResultInfo } = await CREATE_USER(
          userIdToken,
          formattedUser.uid,
          formattedUser.email as string
        );

        if (cResultInfo.resultStatus !== ApiResultStatus.SUCCESS) {
          signOut();

          return;
        }

        // @ts-ignore
        setAuthUser((prev) => {
          return {
            ...formattedUser,
            idToken: userIdToken,
            username: newUser?.username as string,
            dateCreated: newUser?.dateCreated as number,
            highestScoringGame: newUser?.highestScoringGame,
          };
        });
      }
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

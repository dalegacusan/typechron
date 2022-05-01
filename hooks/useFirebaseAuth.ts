import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase-app";
import { createUser, getOneUserById } from "../utils/firebase-functions";

export interface FormattedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  username?: string | null;
  photoUrl: string | null;
}

const formatAuthUser = async (user: User): Promise<FormattedUser> => {
  const loggedInUser = await getOneUserById(user.uid);

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    username: (loggedInUser?.username as string) || null,
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
      const user = await getOneUserById(loggedInUser.uid);

      if (!user) {
        await createUser(loggedInUser.uid, loggedInUser.email as string);
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

    const formattedUser = await formatAuthUser(authState);

    setAuthUser(formattedUser);
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

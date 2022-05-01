import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseApp } from "../config/firebase";

export interface FormattedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}

const formatAuthUser = (user: User): FormattedUser => ({
  uid: user.uid,
  displayName: user.displayName,
  email: user.email,
  photoUrl: user.photoURL,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<FormattedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resetState = () => {
    setAuthUser(null);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const firebaseAuth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    return signInWithRedirect(firebaseAuth, provider);
  };

  const signOut = () => getAuth().signOut().then(resetState);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      resetState();

      return;
    }

    setLoading(true);

    const formattedUser = formatAuthUser(authState);

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

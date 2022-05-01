import { UserCredential } from "firebase/auth";
import { createContext, useContext } from "react";
import { FormattedUser } from "../hooks/useFirebaseAuth";

export const AuthUserContext = createContext<{
  authUser: FormattedUser | null;
  loading: boolean;
  signInWithGoogle: any; // TODO: () => UserCredential
  signOut: () => void;
}>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthUserContext);

import React from "react";
import { AuthUserContext } from "../ contexts/authUserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

interface AuthUserProviderProps {
  children: JSX.Element[] | JSX.Element;
}

const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
  const auth = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export default AuthUserProvider;

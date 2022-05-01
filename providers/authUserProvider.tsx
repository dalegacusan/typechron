import React from "react";
import { AuthUserContext } from "../ contexts/authUserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

const AuthUserProvider = ({ children }) => {
  const auth = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export default AuthUserProvider;

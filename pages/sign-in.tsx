import React, { useState } from "react";

import { useRouter } from "next/router";
import { useAuth } from "../ contexts/authUserContext";

const SignIn = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [isSignInError, setIsSignInError] = useState<boolean>(false);

  const signIn = async () => {
    const { user, error } = await signInWithGoogle();

    if (error) {
      setIsSignInError(true);

      return;
    }

    router.push("/");
  };

  return (
    <div>
      <p>Join the leaderboards. Get started.</p>
      <button onClick={signIn}>Sign in with google</button>

      <p>or play as a guest</p>

      {isSignInError && <p>Failed to sign in.</p>}
    </div>
  );
};

export default SignIn;

import React, { useState } from "react";
import { useAuth } from "../ contexts/authUserContext";
import { Box, Center, Loader, Paper, Text, Title } from "@mantine/core";
import { red } from "../config/app";
import GoogleLoginButton from "../components/social-login-buttons/google-login-btn";
import Link from "next/link";

const SignIn = () => {
  const { loading, signInWithGoogle, authUser } = useAuth();
  const [isSignInError, setIsSignInError] = useState<boolean>(false);

  const signIn = async () => {
    const { code } = await signInWithGoogle();

    if (code) {
      setIsSignInError(true);
    }
  };

  return (
    <Box>
      <Title
        align="center"
        sx={(theme) => ({
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Sign in to join the leaderboards.
      </Text>

      <Center>
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          mt="xl"
          style={{ width: "50%" }}
        >
          {loading && (
            <Center>
              <Loader size="sm" />
            </Center>
          )}

          {!loading && !authUser && (
            <>
              <GoogleLoginButton
                radius="xs"
                variant="white"
                onClick={signIn}
                fullWidth
              >
                Sign in with Google
              </GoogleLoginButton>
              <Box mt="lg">
                <Link href="/" passHref>
                  <Text component="a" variant="link" size="sm" color="gray">
                    or play as a guest
                  </Text>
                </Link>
              </Box>
            </>
          )}

          {!isSignInError && !loading && authUser && (
            <Text color="dimmed" size="sm" align="center" mt={5}>
              You are already signed in.
            </Text>
          )}

          {isSignInError && (
            <Text color={red} align="center" mt={12}>
              Failed to sign in.
            </Text>
          )}
        </Paper>
      </Center>
    </Box>
  );
};

export default SignIn;

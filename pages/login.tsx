import React, { useState } from "react";
import { useAuth } from "../ contexts/authUserContext";
import { Box, Center, Loader, Paper, Text, Title } from "@mantine/core";
import { red } from "../config/app";
import GoogleLoginButton from "../components/social-login-buttons/google-login-btn";
import Link from "next/link";

const SignIn = () => {
  const { loading, signInWithGoogle, authUser } = useAuth();
  const [signInError, setSignInError] = useState<{
    isError: boolean;
    code: string;
    message: string;
  }>({
    isError: false,
    code: "",
    message: "",
  });

  const signIn = async () => {
    const { code, message } = await signInWithGoogle();

    if (code) {
      setSignInError({
        isError: true,
        code,
        message,
      });
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
        Sign in to join the leaderboard.
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

          {!signInError.isError && !loading && authUser && (
            <Text color="dimmed" size="sm" align="center" mt={5}>
              You are already signed in.
            </Text>
          )}

          {signInError.isError && (
            <Text color={red} align="center" mt={12}>
              Failed to sign in. Ref: {signInError.code}
            </Text>
          )}
        </Paper>
      </Center>
    </Box>
  );
};

export default SignIn;

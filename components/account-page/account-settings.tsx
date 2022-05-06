import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, Text, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AlertCircle, Check, DeviceFloppy } from "tabler-icons-react";
import { useAuth } from "../../ contexts/authUserContext";
import { ApiResultStatus } from "../../utils/api/enums/api-result-status.enum";
import { UPDATE_USER } from "../../utils/http";
import { AddOneDayFromUnixTimestamp } from "../../utils/time";
import {
  accountUpdateLimit,
  usernameMaxLength,
  usernameMinLength,
} from "../../config/app";

const AccountSettings = () => {
  const { loading, authUser } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [usernameInputError, setUsernameInputError] = useState<string>("");
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
  const [remainingAccountUpdateCount, setRemainingAccountUpdateCount] =
    useState(accountUpdateLimit);

  // A user can only update username after 1 day
  const [isUpdateDisabled, setIsUpdateDisabled] = useState<boolean>(false);

  const updateUsername = async () => {
    if (remainingAccountUpdateCount === 0 || isUpdateDisabled) {
      showNotification({
        id: "unable-to-update-user",
        autoClose: 5000,
        title: "Failed to update account.",
        message: "Update declined.",
        color: "red",
        icon: <AlertCircle size={16} />,
      });

      return;
    } else {
      const trimmedUsername = username.trim();

      if (!trimmedUsername) {
        setUsernameInputError("Please enter a username.");

        return;
      } else if (trimmedUsername.length > usernameMaxLength) {
        setUsernameInputError(
          `Username must have ${usernameMinLength} - ${usernameMaxLength} characters.`
        );

        return;
      }

      setIsUpdatingUser(true);

      const { resultInfo } = await UPDATE_USER(
        authUser?.idToken as string,
        authUser?.uid as string,
        trimmedUsername
      );

      if (resultInfo.resultStatus === ApiResultStatus.SUCCESS) {
        showNotification({
          id: "success-update-user",
          autoClose: 5000,
          title: "Successfully updated your account!",
          message: "Please refresh to see your latest changes.",
          color: "green",
          icon: <Check size={16} />,
        });
      } else {
        showNotification({
          id: "fail-update-user",
          autoClose: 5000,
          title: "Failed to update account.",
          message: resultInfo.resultMsg,
          color: "red",
          icon: <AlertCircle size={16} />,
        });
      }
    }

    setIsUpdatingUser(false);
    setUsername("");
  };

  useEffect(() => {
    // Show input error when username length exceeds usernameMaxLength characters
    if (username.trim().length > usernameMaxLength) {
      setUsernameInputError(
        `Username must have ${usernameMinLength} - ${usernameMaxLength} characters.`
      );
    } else {
      setUsernameInputError("");
    }
  }, [username]);

  useEffect(() => {
    if (!loading && authUser && authUser.dateCreated) {
      const oneDayFromCreation = AddOneDayFromUnixTimestamp(
        authUser.dateCreated
      );
      const isOneDayPassed = Date.now() > oneDayFromCreation;

      setIsUpdateDisabled(!isOneDayPassed);

      // Need to check if property exists because if updateCount is 0, then
      // this block won't run because 0 is falsy
      // @ref https://stackoverflow.com/a/11040508/12278028
      if ("updateCount" in authUser) {
        // @ts-ignore
        const remaningUpdateCount = accountUpdateLimit - authUser.updateCount;

        setRemainingAccountUpdateCount(remaningUpdateCount);
      }
    }
  }, [loading]);

  return (
    <Box mt={20}>
      {isUpdateDisabled && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Oops!"
          color="red"
          mb={25}
        >
          You are not allowed to change your username yet. You can change your
          username 1 day after creating your account.
        </Alert>
      )}

      {!isUpdateDisabled && (
        <Text
          color={remainingAccountUpdateCount === 0 ? "red" : "yellow"}
          size="sm"
          mb={10}
        >
          {remainingAccountUpdateCount === 0
            ? "You have used all your remaining attempts to update your account."
            : `You have ${remainingAccountUpdateCount} remaining attempt/s to update your account.`}
        </Text>
      )}

      <Grid mb={20}>
        <Grid.Col span={2}>
          <Text>Username</Text>
        </Grid.Col>
        <Grid.Col span={10}>
          <TextInput
            placeholder={authUser?.username as string}
            width="100%"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
            error={usernameInputError}
            disabled={isUpdateDisabled || remainingAccountUpdateCount === 0}
            required
          />
        </Grid.Col>
      </Grid>

      <Box style={{ float: "right" }}>
        <Button
          leftIcon={<DeviceFloppy size={14} />}
          onClick={updateUsername}
          loading={isUpdatingUser}
          disabled={
            isUpdateDisabled ||
            !username ||
            usernameInputError.length > 0 ||
            remainingAccountUpdateCount === 0
          }
        >
          {isUpdatingUser ? "Saving" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AccountSettings;

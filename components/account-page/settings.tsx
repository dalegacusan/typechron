import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, Text, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AlertCircle, Check, DeviceFloppy } from "tabler-icons-react";
import { useAuth } from "../../ contexts/authUserContext";
import { ApiResultStatus } from "../../enums/api/api-result-status.enum";
import { UPDATE_USER } from "../../utils/http";
import { AddOneDayFromUnixTimestamp } from "../../utils/time";

const AccountSettings = () => {
  const { loading, authUser } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [usernameInputError, setUsernameInputError] = useState<string>("");
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);

  // A user can only update username after 1 day
  const [isUpdateDisabled, setIsUpdateDisabled] = useState<boolean>(false);

  const updateUsername = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setUsernameInputError("Please enter a username.");

      return;
    } else if (trimmedUsername.length > 8) {
      setUsernameInputError("Username must have 1 - 8 characters");

      return;
    }

    setIsUpdatingUser(true);

    const { resultInfo } = await UPDATE_USER(
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

    setIsUpdatingUser(false);
    setUsername("");
  };

  useEffect(() => {
    // Show input error when username length exceeds 8 characters
    if (username.trim().length > 8) {
      setUsernameInputError("Username must have 1 - 8 characters");
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
            disabled={isUpdateDisabled}
            required
          />
        </Grid.Col>
      </Grid>

      <Box style={{ float: "right" }}>
        <Button
          leftIcon={<DeviceFloppy size={14} />}
          onClick={updateUsername}
          loading={isUpdatingUser}
          disabled={!username || isUpdateDisabled}
        >
          {isUpdatingUser ? "Saving" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AccountSettings;

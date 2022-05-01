import React, { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Title,
  Indicator,
  Avatar,
  Loader,
  Menu,
  ActionIcon,
  Group,
} from "@mantine/core";
import HelpModal from "../help-modal";
import { useAuth } from "../../ contexts/authUserContext";
import { useRouter } from "next/router";
import { Logout } from "tabler-icons-react";
import Link from "next/link";

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    cursor: "pointer",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

export function PageHeader() {
  const { classes } = useStyles();
  const { authUser, loading, signOut } = useAuth();
  const router = useRouter();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <Header height={HEADER_HEIGHT} mb={70} className={classes.root}>
      <HelpModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <Container size="sm" className={classes.header}>
        <Link href="/" passHref>
          <Title order={3} style={{ cursor: "pointer" }}>
            Typechron
          </Title>
        </Link>

        <Group spacing={5}>
          <a className={classes.link} onClick={() => setIsOpenModal(true)}>
            Help
          </a>
          <a
            className={classes.link}
            onClick={() => router.push("/leaderboards")}
          >
            Leaderboards
          </a>

          {loading && !authUser && <Loader size="sm" />}

          {!loading && !authUser && (
            <a className={classes.link} onClick={() => router.push("/sign-in")}>
              Sign in
            </a>
          )}

          {!loading && authUser && (
            <Menu
              control={
                <ActionIcon>
                  <Avatar
                    src={authUser.photoUrl}
                    alt={authUser.displayName as string}
                    radius="xl"
                  />
                </ActionIcon>
              }
              ml={8}
              gutter={12}
              placement="end"
              withArrow
            >
              <Menu.Label>{authUser.username}</Menu.Label>

              <Menu.Item icon={<Logout size={14} />} onClick={() => signOut()}>
                Sign out
              </Menu.Item>
            </Menu>
          )}
        </Group>
      </Container>
    </Header>
  );
}

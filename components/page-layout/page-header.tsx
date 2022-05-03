import React, { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Title,
  Avatar,
  Loader,
  Menu,
  ActionIcon,
  Group,
  Burger,
  Transition,
  Paper,
} from "@mantine/core";
import { useAuth } from "../../ contexts/authUserContext";
import { useRouter } from "next/router";
import { Logout, User } from "tabler-icons-react";
import { useBooleanToggle } from "@mantine/hooks";
import HelpModal from "../modals/help-modal";
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

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
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

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function PageHeader() {
  const { classes } = useStyles();
  const { authUser, loading, signOut } = useAuth();
  const router = useRouter();
  const [opened, toggleOpened] = useBooleanToggle(false);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const defaultHeaderItems = [
    <>
      <a className={classes.link} onClick={() => router.push("/")}>
        Home
      </a>
    </>,
    <>
      <a className={classes.link} onClick={() => router.push("/leaderboards")}>
        Leaderboards
      </a>
    </>,
    <>
      <a className={classes.link} onClick={() => setIsOpenModal(true)}>
        Help
      </a>
    </>,
  ];
  const headerItemsExpanded = [
    <>{loading && !authUser && <Loader size="sm" />}</>,
    <>
      {!loading && !authUser && (
        <a className={classes.link} onClick={() => router.push("/login")}>
          Sign in
        </a>
      )}
    </>,
    <>
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

          <Menu.Item
            icon={<User size={14} />}
            onClick={() => router.push("/account")}
          >
            My Account
          </Menu.Item>

          <Menu.Item
            color="red"
            icon={<Logout size={14} />}
            onClick={() => signOut()}
          >
            Sign out
          </Menu.Item>
        </Menu>
      )}
    </>,
  ];
  const headerItemsCollapsed = [
    <>{loading && !authUser && <Loader size="sm" />}</>,
    <>
      {!loading && !authUser && (
        <a className={classes.link} onClick={() => router.push("/login")}>
          Sign in
        </a>
      )}
    </>,
    <>
      {!loading && authUser && (
        <>
          <a className={classes.link} onClick={() => router.push("/account")}>
            My account
          </a>
          <a className={classes.link} onClick={() => signOut()}>
            Sign out
          </a>
        </>
      )}
    </>,
  ];

  return (
    <Header height={HEADER_HEIGHT} mb={70} className={classes.root}>
      <HelpModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <Container size="sm" className={classes.header}>
        <Link href="/" passHref>
          <Title order={3} style={{ cursor: "pointer" }}>
            Typechron
          </Title>
        </Link>

        <Group spacing={5} className={classes.links}>
          {defaultHeaderItems.concat(headerItemsExpanded)}
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {defaultHeaderItems.concat(headerItemsCollapsed)}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}

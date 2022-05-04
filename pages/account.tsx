import React, { useEffect, useState } from "react";
import { Box, Group, Loader, Tabs, Text, Title } from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES } from "../utils/http";
import { QueryOrderDirection } from "../enums/api/query-order-direction.enum";
import { History, Settings } from "tabler-icons-react";
import PageNotFound from "./404";
import GamesHistory from "../components/account-page/games-history";
import AccountSettings from "../components/account-page/settings";

const UserAccount = () => {
  const { authUser, loading } = useAuth();
  const [games, setGames] = useState<Game[]>();
  const [gameLastKey, setGameLastKey] = useState<number | undefined>();
  const [isLoadingNextGames, setIsLoadingNextGames] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && authUser) {
      QUERY_GAMES(
        10,
        { direction: QueryOrderDirection.DESC, fieldPath: "dateCreated" },
        authUser.uid
      )
        .then((data) => {
          const { games, lastKey } = data;

          //@ts-ignore
          setGames(games);
          setGameLastKey(lastKey);
        })
        .catch(() => {});
    }
  }, [loading]);

  return (
    <Box mb={70}>
      {loading && !authUser && <Loader size="sm" />}

      {!loading && !authUser && (
        <>
          <PageNotFound />
        </>
      )}

      {!loading && authUser && (
        <Box>
          <Title order={2}>My Account</Title>
          <Group grow>
            <Text size="sm" color="dimmed" mt={4}>
              Hello, {authUser.username}
            </Text>
            {games && games.length !== 0 && (
              <Text size="sm" align="right" color="dimmed">
                Showing {games.length} record{games.length !== 1 && "s"}
              </Text>
            )}
          </Group>

          <Tabs color="blue" mt={30}>
            <Tabs.Tab label="History" icon={<History size={16} />}>
              <GamesHistory
                games={games}
                setGames={setGames}
                gameLastKey={gameLastKey}
                setGameLastKey={setGameLastKey}
                isLoadingNextGames={isLoadingNextGames}
                setIsLoadingNextGames={setIsLoadingNextGames}
              />
            </Tabs.Tab>
            <Tabs.Tab label="Settings" icon={<Settings size={16} />}>
              <AccountSettings />
            </Tabs.Tab>
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default UserAccount;

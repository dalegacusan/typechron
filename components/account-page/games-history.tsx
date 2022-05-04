import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { useAuth } from "../../ contexts/authUserContext";
import { QueryOrderDirection } from "../../utils/api/enums/query-order-direction.enum";
import { Game } from "../../interfaces/game.interface";
import { QUERY_GAMES } from "../../utils/http";
import GameRecord from "../game-record";
import GameRecordModal from "../modals/game-record-modal";

interface GamesHistoryProps {
  games: Game[] | undefined;
  setGames: (games: Game[]) => void;
  gameLastKey: number | undefined;
  setGameLastKey: (lastKey: number) => void;
  isLoadingNextGames: boolean;
  setIsLoadingNextGames: (isLoading: boolean) => void;
}

const GamesHistory = (props: GamesHistoryProps) => {
  const {
    games,
    setGames,
    gameLastKey,
    setGameLastKey,
    isLoadingNextGames,
    setIsLoadingNextGames,
  } = props;
  const { authUser, loading } = useAuth();
  const [isGameModalOpened, setIsGameModalOpened] = useState<boolean>(false);
  const [gameToDisplayInModal, setGameToDisplayInModal] = useState<Game>();

  const handleRecordClick = (game: any) => {
    setGameToDisplayInModal(game);
    setIsGameModalOpened(true);
  };

  const getMoreGames = (lastKey: number | undefined) => {
    if (!loading && authUser && lastKey) {
      setIsLoadingNextGames(true);

      const getUserGames = async () =>
        QUERY_GAMES(
          10,
          { direction: QueryOrderDirection.DESC, fieldPath: "dateCreated" },
          authUser.uid,
          gameLastKey
        );

      getUserGames()
        .then(({ games, lastKey }) => {
          // @ts-ignore
          setGames((prev) => [...prev, ...games]);
          setGameLastKey(lastKey as number);
          setIsLoadingNextGames(false);
        })
        .catch();
    }
  };

  return (
    <Box mt={20}>
      {gameToDisplayInModal && (
        <GameRecordModal
          game={gameToDisplayInModal}
          isGameModalOpened={isGameModalOpened}
          setIsGameModalOpened={setIsGameModalOpened}
        />
      )}

      {!games && <Loader size="sm" />}

      {games && games.length === 0 && (
        <Text color="dimmed">No available data</Text>
      )}

      {games && games.length !== 0 && (
        <>
          {authUser?.highestScoringGame &&
            authUser?.highestScoringGame.score !== 0 && (
              <Box>
                <Title order={5}>High Score</Title>
                <Box
                  sx={(theme) => {
                    return {
                      backgroundColor: theme.colors.lime[4],
                      color: theme.colors.dark[9],
                      padding: theme.spacing.xs,
                      paddingLeft: theme.spacing.lg,
                      paddingRight: theme.spacing.lg,
                      cursor: "pointer",

                      "&:hover": {
                        backgroundColor: theme.colors.lime[5],
                      },
                    };
                  }}
                  onClick={() =>
                    handleRecordClick(authUser?.highestScoringGame)
                  }
                  mt={10}
                  mb={35}
                >
                  <Group grow>
                    <Box>
                      <Text size="sm">
                        {authUser && `${authUser.username}`}
                      </Text>
                    </Box>
                    <Box>
                      <Group grow>
                        <Text size="sm" align="right">
                          {authUser?.highestScoringGame?.wpm} wpm
                        </Text>
                        <Text size="sm" align="right">
                          {authUser?.highestScoringGame?.score} points
                        </Text>
                      </Group>
                    </Box>
                  </Group>
                </Box>
              </Box>
            )}

          <Stack>
            {games.map((game: Game, idx: number) => {
              return (
                <GameRecord
                  key={game.id}
                  index={idx}
                  game={game}
                  handleRecordClick={() => handleRecordClick(game)}
                  isLeaderboard={false}
                />
              );
            })}
          </Stack>

          <Center mt={30}>
            {gameLastKey ? (
              <Button
                onClick={() => getMoreGames(gameLastKey)}
                loading={isLoadingNextGames}
                size="xs"
                variant="subtle"
                color="gray"
              >
                Load more records
              </Button>
            ) : (
              <Text size="xs">You&apos;re up-to-date!</Text>
            )}
          </Center>
        </>
      )}
    </Box>
  );
};

export default GamesHistory;

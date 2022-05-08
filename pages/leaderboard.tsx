import React, { useEffect, useState } from "react";
import { Box, Loader, Stack, Text, Title } from "@mantine/core";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES_LEADERBOARD } from "../utils/http";
import { useModals } from "@mantine/modals";
import { AlertCircle } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { ApiResultStatus } from "../utils/api/enums/api-result-status.enum";
import GameRecordModalContent from "../components/modal-content/game-record-modal-content";
import GameRecord from "../components/game-record";
import Head from "next/head";

const Leaderboard = () => {
  const modals = useModals();
  const [games, setGames] = useState<Game[]>();

  const openGameRecordModal = (game: Game) => {
    if (game) {
      modals.openModal({
        title: "Words List",
        children: <GameRecordModalContent game={game} />,
      });
    }
  };

  useEffect(() => {
    QUERY_GAMES_LEADERBOARD()
      .then((data) => {
        if (data.resultInfo.resultStatus === ApiResultStatus.FAILURE) {
          showNotification({
            id: "fail-query-leaderboard-games",
            autoClose: 5000,
            title: "Something went wrong.",
            message: `Failed to retrieve records. Ref: ${data.resultInfo.resultCode}`,
            color: "red",
            icon: <AlertCircle size={16} />,
          });

          setGames([]);
        } else {
          const { games } = data;

          //@ts-ignore
          setGames(games);
        }
      })
      .catch(() => {
        showNotification({
          id: "fail-query-leaderboard-games",
          autoClose: 5000,
          title: "Something went wrong.",
          message: "Failed to retrieve records.",
          color: "red",
          icon: <AlertCircle size={16} />,
        });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Typechron - Leaderboard</title>
      </Head>
      <Box mb={70}>
        <Title order={2}>Leaderboard</Title>
        <Text size="sm" color="dimmed" mt={4}>
          Click on a record for more information
        </Text>

        <Box mt={30}>
          {!games && <Loader size="sm" />}

          {games && games.length === 0 && (
            <Text color="dimmed">No available data</Text>
          )}

          {games && games.length !== 0 && (
            <Stack>
              {games.map((game: Game, idx: number) => {
                return (
                  <GameRecord
                    key={game.id}
                    index={idx}
                    game={game}
                    handleRecordClick={() => openGameRecordModal(game)}
                    isLeaderboard={true}
                  />
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Leaderboard;

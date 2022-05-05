import React from "react";
import { Box, Loader, Stack, Text, Title } from "@mantine/core";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES } from "../utils/http";
import { QueryOrderDirection } from "../utils/api/enums/query-order-direction.enum";
import { useModals } from "@mantine/modals";
import GameRecordModalContent from "../components/modal-content/game-record-modal-content";
import GameRecord from "../components/game-record";

interface LeaderboardsProps {
  games: Game[];
}

const Leaderboards = (props: LeaderboardsProps) => {
  const modals = useModals();

  const openGameRecordModal = (game: Game) => {
    if (game) {
      modals.openModal({
        title: "Words List",
        children: <GameRecordModalContent game={game} />,
      });
    }
  };

  return (
    <Box mb={70}>
      <Title order={2}>Leaderboards</Title>
      <Text size="sm" color="dimmed" mt={4}>
        Click on a record for more information
      </Text>

      <Box mt={30}>
        {!props.games && <Loader size="sm" />}

        {props.games && props.games.length === 0 && (
          <Text color="dimmed">No available data</Text>
        )}

        {props.games && props.games.length !== 0 && (
          <Stack>
            {props.games.map((game: Game, idx: number) => {
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
  );
};

export default Leaderboards;

export async function getServerSideProps() {
  const { games } = await QUERY_GAMES(10, {
    direction: QueryOrderDirection.DESC,
    fieldPath: "score",
  });

  return {
    props: { games },
  };
}

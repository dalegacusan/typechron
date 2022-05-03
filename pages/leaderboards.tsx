import React, { useState } from "react";
import { Box, Loader, Stack, Text, Title } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES } from "../utils/http";
import { QueryOrderDirection } from "../enums/api/query-order-direction.enum";
import GameRecordModal from "../components/modals/game-record-modal";
import GameRecord from "../components/game-record";

interface LeaderboardsProps {
  games: Game[];
}

const Leaderboards = (props: LeaderboardsProps) => {
  const [isGameModalOpened, setIsGameModalOpened] = useState<boolean>(false);
  const [gameToDisplayInModal, setGameToDisplayInModal] = useState<Game>();

  const handleRecordClick = (game: Game) => {
    setGameToDisplayInModal(game);
    setIsGameModalOpened(true);
  };

  return (
    <Box mb={70}>
      {gameToDisplayInModal && (
        <GameRecordModal
          game={gameToDisplayInModal}
          isGameModalOpened={isGameModalOpened}
          setIsGameModalOpened={setIsGameModalOpened}
        />
      )}

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
                  key={idx}
                  index={idx}
                  game={game}
                  handleRecordClick={() => handleRecordClick(game)}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { games } = await QUERY_GAMES(10, {
    direction: QueryOrderDirection.DESC,
    fieldPath: "score",
  });

  return {
    props: { games },
  };
}

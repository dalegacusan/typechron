import React, { useState } from "react";
import { Box, Loader, Stack, Text, Title } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { Game } from "../interfaces/game.interface";
import { getTop20Games } from "../utils/firebase-functions";
import GameModal from "../components/modals/game-modal";
import GameRecord from "../components/game-record";

interface LeaderboardsProps {
  games: Game[];
}

const Leaderboards = (props: LeaderboardsProps) => {
  const [isGameModalOpened, setIsGameModalOpened] = useState<boolean>(false);
  const [gameToDisplay, setGameToDisplay] = useState<Game>();

  const handleContentClick = (game: Game) => {
    setGameToDisplay(game);
    setIsGameModalOpened(true);
  };

  return (
    <Box mb={70}>
      {gameToDisplay && (
        <GameModal
          game={gameToDisplay}
          isGameModalOpened={isGameModalOpened}
          setIsGameModalOpened={setIsGameModalOpened}
        />
      )}

      <Title order={2}>Leaderboards</Title>
      <Text size="sm" color="dimmed">
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
                  handleContentClick={() => handleContentClick(game)}
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
  const games = await getTop20Games();

  return {
    props: { games },
  };
}

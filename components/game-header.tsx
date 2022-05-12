import React from "react";
import { initialGameTimeInMs } from "../config/app";
import { Grid, Text } from "@mantine/core";
import GameTime from "./game-time";

interface GameHeaderProps {
  isInGame: boolean;
  isGameEnded: boolean;
  round: number;
}

const GameHeader = (props: GameHeaderProps) => {
  const { isInGame, isGameEnded, round } = props;

  return (
    <Grid grow>
      <Grid.Col span={12}>
        <Text size="xl">
          {/* Display Round */}
          {!isGameEnded && `Round ${round}`}
          {/* Display "Game Ended" */}
          {/* Should not include the last word (which is a new word) */}
          {!isInGame &&
            isGameEnded &&
            `Game Over - Round ${round === 1 ? 1 : round - 1}`}
        </Text>
      </Grid.Col>
    </Grid>
  );
};

export default GameHeader;

import React from "react";
import Countdown from "react-countdown";
import { initialGameTimeInMs } from "../config";
import { Grid, Text } from "@mantine/core";
import GameTime from "./game-time";

interface GameHeaderProps {
  isInGame: boolean;
  isGameEnded: boolean;
  gameTime: number;
  round: number;
}

const GameHeader = (props: GameHeaderProps) => {
  const { isInGame, isGameEnded, gameTime, round } = props;

  return (
    <Grid grow>
      <Grid.Col span={4}>
        <Text size="xl">
          {isInGame ? (
            // Display game time in milliseconds
            <Countdown
              date={Date.now() + gameTime}
              intervalDelay={20}
              precision={3}
              renderer={GameTime}
            />
          ) : (
            // Display default time
            `${initialGameTimeInMs / 1000.0}:00s` // @ref https://stackoverflow.com/a/14090907/12278028
          )}
        </Text>
      </Grid.Col>
      <Grid.Col span={4}>
        <Text size="xl" align="right">
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

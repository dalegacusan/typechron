import { Progress } from "@mantine/core";
import React from "react";

interface TimerBarProps {
  isInGame: boolean;
  gameTime: number;
}

const TimerBar = (props: TimerBarProps) => {
  const { isInGame, gameTime } = props;

  const gameTimeIntervalBy100 = gameTime / 100;
  const gameTimeIntervalBy10 = gameTime / 1000;
  let color;

  if (gameTimeIntervalBy100 > 60) {
    color = "green";
  } else if (gameTimeIntervalBy100 >= 40 && gameTimeIntervalBy100 <= 60) {
    color = "yellow";
  } else {
    color = "red";
  }

  return (
    <Progress
      value={gameTimeIntervalBy100}
      label={gameTimeIntervalBy10.toString()}
      color={color}
      size="lg"
      animate={isInGame}
    />
  );
};

export default TimerBar;

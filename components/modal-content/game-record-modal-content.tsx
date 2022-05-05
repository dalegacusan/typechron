import { Box, Divider, Group, Space, Text } from "@mantine/core";
import { Game } from "../../interfaces/game.interface";
import React from "react";
import DoneWords from "../done-words";

interface GameRecordModalContentProps {
  game: Game;
}

const GameRecordModalContent = (props: GameRecordModalContentProps) => {
  const { game } = props;

  const date = new Date(game.dateCreated as number);
  const year = date.getFullYear(); // 2020
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "04"
  const day = date.getDate().toString().padStart(2, "0"); // "09"

  return (
    <Box>
      <Divider my="sm" />
      <Space h="md" />

      <Box>
        <DoneWords words={game.words} />
      </Box>

      <Space h="lg" />

      <Group grow>
        <Text size="sm" color="dimmed">
          Round {game.round}
        </Text>
        <Text size="sm" color="dimmed" align="right">
          {`${month}/${day}/${year}`}
        </Text>
      </Group>
    </Box>
  );
};

export default GameRecordModalContent;

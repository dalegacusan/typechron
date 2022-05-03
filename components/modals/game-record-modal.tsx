import { Box, Divider, Group, Modal, Space, Text } from "@mantine/core";
import { Game } from "../../interfaces/game.interface";
import React from "react";
import DoneWords from "../done-words";

interface GameRecordModalProps {
  game: Game;
  isGameModalOpened: boolean;
  setIsGameModalOpened: (isOpened: boolean) => void;
}

const GameRecordModal = (props: GameRecordModalProps) => {
  const { game, isGameModalOpened, setIsGameModalOpened } = props;

  const date = new Date(game.dateCreated as number);
  const year = date.getFullYear(); // 2020
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "04"
  const day = date.getDate().toString().padStart(2, "0"); // "09"

  return (
    <Modal
      opened={isGameModalOpened}
      onClose={() => setIsGameModalOpened(false)}
      title="Words List"
    >
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
    </Modal>
  );
};

export default GameRecordModal;

import { Box, Divider, Group, Modal, Space, Text } from "@mantine/core";
import { Game } from "../../interfaces/game.interface";
import React from "react";
import DoneWords from "../done-words";

interface GameModalProps {
  game: Game;
  isGameModalOpened: boolean;
  setIsGameModalOpened: (isOpened: boolean) => void;
}

const GameModal = (props: GameModalProps) => {
  const { game, isGameModalOpened, setIsGameModalOpened } = props;

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
          {game.dateCreated.toString()}
        </Text>
      </Group>
    </Modal>
  );
};

export default GameModal;

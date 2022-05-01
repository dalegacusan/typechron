import { Divider, Modal, Space } from "@mantine/core";
import React from "react";
import DoneWords from "./done-words";

interface GameWordsModalProps {
  words: string[];
  isWordsModalOpened: boolean;
  setIsWordsModalOpened: (isOpened: boolean) => void;
}

const GameWordsModal = (props: GameWordsModalProps) => {
  const { words, isWordsModalOpened, setIsWordsModalOpened } = props;

  return (
    <Modal
      opened={isWordsModalOpened}
      onClose={() => setIsWordsModalOpened(false)}
      title="List of words"
    >
      <Divider my="sm" />
      <Space h="md" />

      <DoneWords words={words} />
    </Modal>
  );
};

export default GameWordsModal;

import {
  Alert,
  Code,
  Divider,
  Modal,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { InfoCircle } from "tabler-icons-react";

interface HelpModalProps {
  isOpenModal: boolean;
  setIsOpenModal: (v: boolean) => void;
}

const HelpModal = (props: HelpModalProps) => {
  const { isOpenModal, setIsOpenModal } = props;
  const theme = useMantineTheme();

  return (
    <Modal
      opened={isOpenModal}
      onClose={() => setIsOpenModal(false)}
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      title="How to play"
      centered
    >
      <Divider my="sm" />
      <Space h="md" />

      <Text>
        1. Type <Code>start</Code> in the text box to begin the game.
      </Text>
      <Space h="sm" />

      <Text>
        2. You have 10 seconds to play. Type out each word as fast as you can.
      </Text>
      <Space h="sm" />

      <Text>3. For each word you get correctly, you get 1 extra second.</Text>
      <Space h="md" />

      <Alert icon={<InfoCircle size={16} />} title="Bonus!" color="blue">
        There is a small chance that you get an extra 2 seconds instead of 1 😉
      </Alert>
      <Space h="md" />

      <Text>Goodluck!</Text>
      <Space h="sm" />

      <Text align="right">
        <Text
          variant="link"
          component="a"
          href="https://github.com/dalegacusan/typing-game"
          target="_blank"
        >
          github
        </Text>
      </Text>
    </Modal>
  );
};

export default HelpModal;

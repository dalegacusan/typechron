import React from "react";
import {
  Alert,
  Box,
  Code,
  Divider,
  Space,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { BrandGithub, InfoCircle } from "tabler-icons-react";
import Link from "next/link";

const HelpModalContent = () => {
  return (
    <Box>
      <Divider my="sm" />
      <Space h="md" />

      <Title order={4}>How to play?</Title>
      <Space h="sm" />

      <Text size="sm">
        1. Type <Code>start</Code> in the text box to begin the game.
      </Text>
      <Space h="sm" />

      <Text size="sm">
        2. You have 10 seconds to play. Type out each word as fast as you can.
      </Text>
      <Space h="sm" />

      <Text size="sm">
        3. For each word you get correctly, you get 1 extra second.
      </Text>
      <Space h="md" />

      <Alert icon={<InfoCircle size={16} />} title="Bonus!" color="blue">
        There is a small chance that you get an extra 2 seconds instead of 1 😉
      </Alert>
      <Space h="md" />
      <Space h="md" />

      <Title order={4}>How do I join the leaderboard?</Title>
      <Space h="sm" />

      <Text size="sm">
        You can join the leaderboard when you are{" "}
        <Link href="/login" passHref>
          <Text
            variant="link"
            component="a"
            size="sm"
            style={{ cursor: "pointer" }}
          >
            signed in
          </Text>
        </Link>
        . Otherwise, you are playing as a guest.
      </Text>

      <Space h="md" />
      <Space h="sm" />

      <Title order={4}>Can I change my username?</Title>
      <Space h="sm" />

      <Text size="sm">
        Yes. You can change your username 1 day after creating your account.
      </Text>

      <Space h="sm" />

      <Text align="right">
        <Tooltip label="Github" withArrow>
          <a
            href="https://github.com/dalegacusan/typing-game"
            target="_blank"
            rel="noreferrer"
          >
            <BrandGithub size={22} color="gray" />
          </a>
        </Tooltip>
      </Text>
    </Box>
  );
};

export default HelpModalContent;

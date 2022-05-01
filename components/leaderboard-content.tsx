import { Box, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import { Game } from "../interfaces/game.interface";

interface GameContentProps {
  index: number;
  game: Game;
  handleContentClick: (words: string[]) => void;
}

const LeaderboardContent = (props: GameContentProps) => {
  const { index, game, handleContentClick } = props;
  const { points, user, words, wpm } = game;

  return (
    <Box
      sx={(theme) => {
        let bgColor = theme.colors.dark[6];
        let hoverColor = theme.colors.dark[5];

        if (index === 0) {
          bgColor = theme.colors.lime[4];
          hoverColor = theme.colors.lime[5];
        } else if (index === 1) {
          bgColor = theme.colors.orange[4];
          hoverColor = theme.colors.orange[5];
        } else if (index === 2) {
          bgColor = theme.colors.yellow[2];
          hoverColor = theme.colors.yellow[3];
        }

        return {
          backgroundColor: bgColor,
          color: index < 3 ? theme.colors.dark[9] : theme.colors.dark[0],
          padding: theme.spacing.xs,
          paddingLeft: theme.spacing.lg,
          paddingRight: theme.spacing.lg,
          cursor: "pointer",

          "&:hover": {
            backgroundColor: hoverColor,
          },
        };
      }}
      onClick={() => handleContentClick(words)}
    >
      <SimpleGrid cols={2}>
        <Box>
          <Text size="sm">
            {index + 1}. {user.username}
          </Text>
        </Box>
        <Box>
          <SimpleGrid cols={2} spacing="xs">
            <Box>
              <Text size="sm" align="right">
                {wpm} wpm
              </Text>
            </Box>
            <Box>
              <Text size="sm" align="right">
                {points} points
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default LeaderboardContent;

import React, { useEffect, useState } from "react";
import { Grid, Group, Paper, Text } from "@mantine/core";
import { Check } from "tabler-icons-react";
import { black } from "../config";
import Wpm from "./wpm";

interface GameStatsProps {
  score: number;
  wpm: string;
}

const GameStats = (props: GameStatsProps) => {
  const { score, wpm } = props;

  const [previousWpm, setPreviousWpm] = useState<string>(wpm);
  const [isWpmIncreased, setIsWpmIncreased] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    if (Number(wpm) > Number(previousWpm)) {
      setIsWpmIncreased(true);
    } else {
      setIsWpmIncreased(false);
    }

    setPreviousWpm(wpm);
  }, [wpm]);

  return (
    <Grid grow>
      <Grid.Col span={4}>
        <Paper
          p="md"
          my="md"
          style={{
            color: black,
            background:
              "linear-gradient(90deg, rgba(77,171,247,1) 0%, rgba(116,192,252,1) 100%)",
          }}
          withBorder
        >
          <Group>
            <Check />
            <Text>{score} points</Text>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper
          p="md"
          my="md"
          style={{
            color: black,
            background: isWpmIncreased
              ? "linear-gradient(90deg, rgba(130,201,30,1) 0%, rgba(169,227,75,1) 100%)"
              : "linear-gradient(90deg, rgba(255,107,107,1) 0%, rgba(255,107,107,1) 100%)",
          }}
          withBorder
        >
          <Group>
            <Wpm wpm={wpm} isWpmIncreased={isWpmIncreased} />
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default GameStats;

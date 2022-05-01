import React, { useEffect, useState } from "react";
import { Box, Stack, Title } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { Game } from "../interfaces/game.interface";
import { getTop20Games } from "../utils/firebase-functions";
import GameWordsModal from "../components/game-words-modal";
import LeaderboardContent from "../components/leaderboard-content";

const Leaderboards = (props) => {
  const [isWordsModalOpened, setIsWordsModalOpened] = useState<boolean>(false);
  const [wordsToDisplay, setWordsToDisplay] = useState<string[]>([]);

  const handleContentClick = (words: string[]) => {
    setWordsToDisplay(words);
    setIsWordsModalOpened(true);
  };

  useEffect(() => {}, [props]);

  if (!props.games) {
    return <p>Loading...</p>;
  }

  return (
    <Box mb={70}>
      <GameWordsModal
        words={wordsToDisplay}
        isWordsModalOpened={isWordsModalOpened}
        setIsWordsModalOpened={setIsWordsModalOpened}
      />
      <Title order={2}>Leaderboards</Title>

      <Stack mt={30}>
        {props.games.map((game: Game, idx: number) => {
          return (
            <LeaderboardContent
              key={idx}
              index={idx}
              game={game}
              handleContentClick={handleContentClick}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default Leaderboards;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const games = await getTop20Games();

  return {
    props: { games },
  };
}

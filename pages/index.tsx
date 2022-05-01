import type { NextPage } from "next";
import { GenerateWord } from "../utils/words";
import { useEffect, useState } from "react";
import { CurrentTime } from "../utils/time";
import { initialGameTimeInMs } from "../config";
import { Box, Button, Input, Paper, Text } from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { createGame } from "../utils/firebase-functions";
import { Game } from "../interfaces/game.interface";
import { Check, Plus } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import CurrentWord from "../components/current-word";
import GameHeader from "../components/game-header";
import GameStats from "../components/game-stats";
import Link from "next/link";

const Home: NextPage = () => {
  const { authUser, loading } = useAuth();

  const [userInput, setUserInput] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [doneWords, setDoneWords] = useState<Array<string>>(["start"]); // 0th round will always be the word "start"
  const [gameTime, setGameTime] = useState<number>(initialGameTimeInMs);
  const [gameTimeIntervalId, setGameTimeIntervalId] =
    useState<ReturnType<typeof setInterval>>(); // @ref https://stackoverflow.com/a/59681620/12278028
  const [isInGame, setIsInGame] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isRecordSaved, setIsRecordSaved] = useState(false);

  const [gameStartTime, setGameStartTime] = useState<number | undefined>(
    undefined
  );
  const [wpm, setWpm] = useState<string>("0");

  const handleAdditionalGameTime = () => {
    // 1 in 10 chance to get extra 2 seconds
    const r = Math.floor(Math.random() * 10);

    if (r === 0) {
      setGameTime((prevGameTime) => (prevGameTime += 2000));

      return;
    }

    // Get 1 second every round by default
    setGameTime((prevGameTime) => (prevGameTime += 1000));
  };

  const handleInitiateRound = () => {
    let word = GenerateWord();

    setUserInput("");

    while (true) {
      if (doneWords.includes(word)) {
        word = GenerateWord();
      } else {
        setCurrentWord(word);
        setDoneWords((prevWords) => [...prevWords, word]);

        break;
      }
    }
  };

  const handleStartGame = () => {
    // Reset game state
    setIsGameEnded(false);
    setUserScore(0);
    setDoneWords([]);
    setWpm("0");
    setIsRecordSaved(false);

    setIsInGame(true);

    handleInitiateRound();

    const gameTimeInterval = setInterval(() => {
      setGameTime((prevGameTime) => (prevGameTime -= 1000));
    }, 1000);

    setGameTimeIntervalId(gameTimeInterval);
  };

  const handleEndGame = () => {
    if (gameTimeIntervalId) {
      clearInterval(gameTimeIntervalId);
    }

    setGameTimeIntervalId(undefined);
    setGameTime(initialGameTimeInMs);

    setUserInput("");
    setCurrentWord("");
    setIsInGame(false);
    setIsGameEnded(true);

    setGameStartTime(undefined);

    // Update high score
  };

  const handleSaveRecord = async () => {
    const newGameRecord: Game = await createGame({
      userId: authUser.uid,
      round: doneWords.length - 1,
      points: userScore,
      wpm: Number(wpm),
      words: doneWords,
    });

    if (newGameRecord.id) {
      setIsRecordSaved(true);

      showNotification({
        id: "saved-record",
        autoClose: 5000,
        title: "Record saved!",
        message: "Did you make it to the leaderboards?",
        color: "green",
        icon: <Check />,
      });
    }
  };

  useEffect(() => {
    if (!isInGame && userInput.toLowerCase() === "start") {
      handleStartGame();
    }

    if (isInGame && !gameStartTime) {
      setGameStartTime(CurrentTime());
    }

    if (isInGame && userInput.trim() === currentWord) {
      if (gameStartTime) {
        // @ref https://betterprogramming.pub/create-a-typing-game-with-react-hooks-usekeypress-and-faker-28bbc7919820
        const durationInMinutes = (CurrentTime() - gameStartTime) / 60000.0;

        setWpm(((doneWords.length + 1) / durationInMinutes).toFixed(2));
      }

      setUserScore((prevUserScore) => (prevUserScore += currentWord.length));
      handleAdditionalGameTime();
      handleInitiateRound();
    }
  }, [userInput]);

  useEffect(() => {
    if (gameTime <= 0) {
      handleEndGame();
    }
  }, [gameTime]);

  return (
    <div>
      <GameHeader
        isInGame={isInGame}
        isGameEnded={isGameEnded}
        gameTime={gameTime}
        round={doneWords.length}
      />

      <GameStats score={userScore} wpm={wpm} />

      <CurrentWord
        word={currentWord}
        userInput={userInput}
        isInGame={isInGame}
      />

      {/* TODO - Add a visual indicator like +1 on every correct word (Mantine Tooltip?) */}
      <Paper
        px="md"
        py="xs"
        my="md"
        style={{ backgroundColor: "#101113" }}
        withBorder
      >
        <Input
          variant="unstyled"
          size="lg"
          placeholder={isInGame ? currentWord : "start"}
          value={userInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserInput(e.target.value)
          }
          onPaste={(e: React.FormEvent<HTMLInputElement>) => {
            e.preventDefault();
            return false;
          }} // Prevent pasting in input
          autoComplete="false"
        />
      </Paper>

      <Box mb={12}>
        {isGameEnded && !loading && !authUser && (
          <Link href="/sign-in" passHref>
            <Text component="a" variant="link">
              Sign in to save your record
            </Text>
          </Link>
        )}

        {isGameEnded && !loading && authUser && !isRecordSaved && (
          <Button
            color="gray"
            onClick={handleSaveRecord}
            leftIcon={<Plus size={12} />}
          >
            Save record
          </Button>
        )}
      </Box>

      {/* Display done words for reference on how well a user did */}
      <Box>
        {doneWords.map((word: string, idx: number) => {
          const isNewWord = doneWords.length - 1 === idx;
          const withComma = doneWords.length - 2 === idx;

          // Don't display the new word that hasn't been finished yet
          if (isNewWord) {
            return null;
          }

          return (
            <Text key={idx} component="span">
              {word}
              {withComma ? "" : ", "}
            </Text>
          );
        })}
      </Box>
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import { GenerateWord } from "../utils/words";
import { useEffect, useState } from "react";
import { CurrentTimeInMs } from "../utils/time";
import { black, initialDoneWords, initialGameTimeInMs } from "../config/app";
import { Box, Button, Input, Paper, Text } from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { Check, Plus, Refresh } from "tabler-icons-react";
import { CREATE_GAME } from "../utils/http";
import { showNotification } from "@mantine/notifications";
import CurrentWord from "../components/current-word";
import GameHeader from "../components/game-header";
import GameStats from "../components/game-stats";
import Link from "next/link";
import DoneWords from "../components/done-words";

const Home: NextPage = () => {
  const { authUser, loading } = useAuth();

  const [userInput, setUserInput] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [doneWords, setDoneWords] = useState<Array<string>>(initialDoneWords); // 0th round will always be the word "start"
  const [wpm, setWpm] = useState<string>("0");
  const [gameStartTime, setGameStartTime] = useState<number | undefined>(
    undefined
  );
  const [gameTime, setGameTime] = useState<number>(initialGameTimeInMs);
  const [gameTimeIntervalId, setGameTimeIntervalId] =
    useState<ReturnType<typeof setInterval>>(); // @ref https://stackoverflow.com/a/59681620/12278028
  const [isInGame, setIsInGame] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [isRecordSaved, setIsRecordSaved] = useState(false);

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
    // These were not reset in handleEndGame() because
    // we need to display the user statistics (ex. wpm)
    // at the end of each game
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

    setCurrentWord("");
    setUserInput("");
    setIsInGame(false);
    setIsGameEnded(true);

    setGameStartTime(undefined);
  };

  const handleRestartGame = () => {
    handleEndGame();

    setIsGameEnded(false);
    setUserScore(0);
    setDoneWords(initialDoneWords);
    setWpm("0");
    setIsRecordSaved(false);
  };

  const handleSaveRecord = async () => {
    setIsSavingRecord(true);

    const { game: newGameRecord } = await CREATE_GAME(
      authUser?.uid as string,
      doneWords.length - 1,
      userScore,
      Number(wpm),
      doneWords
    );

    if (newGameRecord?.id) {
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

    setIsSavingRecord(false);
  };

  useEffect(() => {
    if (!isInGame && userInput.toLowerCase() === "start") {
      handleStartGame();
    }

    if (isInGame && !gameStartTime) {
      setGameStartTime(CurrentTimeInMs());
    }

    if (isInGame && userInput.trim() === currentWord) {
      if (gameStartTime) {
        // @ref https://betterprogramming.pub/create-a-typing-game-with-react-hooks-usekeypress-and-faker-28bbc7919820
        const durationInMinutes = (CurrentTimeInMs() - gameStartTime) / 60000.0;

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
    <Box>
      {/* TODO - Add a visual indicator like +1 on every correct word (Mantine Tooltip?) */}

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

      {/* Word Input */}
      <Paper
        px="md"
        py="xs"
        my="md"
        style={{ backgroundColor: black }}
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

      {/* Save record button */}
      <Box mb={14}>
        {isGameEnded && !loading && !authUser && (
          <Link href="/login" passHref>
            <Text component="a" variant="link">
              Sign in to save your record
            </Text>
          </Link>
        )}

        {isInGame && !isGameEnded && (
          <Button
            color="gray"
            onClick={handleRestartGame}
            leftIcon={<Refresh size={12} />}
          >
            Restart
          </Button>
        )}

        {isGameEnded &&
          !loading &&
          authUser &&
          !isRecordSaved &&
          userScore !== 0 && (
            <Button
              color="gray"
              onClick={handleSaveRecord}
              leftIcon={<Plus size={12} />}
              loading={isSavingRecord}
            >
              Save record
            </Button>
          )}
      </Box>

      {/* Display done words for reference on how well a user did */}
      <Box>
        <DoneWords words={doneWords} />
      </Box>
    </Box>
  );
};

export default Home;

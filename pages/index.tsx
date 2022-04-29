import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { GenerateWord } from "../utils/words";
import { useEffect, useState } from "react";
import { CurrentTime } from "../utils/time";
import Countdown from "react-countdown";
import GameTime from "./components/game-time";

const gameInitialTimeInMs = 10000;

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [doneWords, setDoneWords] = useState<Array<string>>([]);
  const [gameTime, setGameTime] = useState<number>(gameInitialTimeInMs);
  const [gameTimeIntervalId, setGameTimeIntervalId] =
    useState<ReturnType<typeof setInterval>>(); // @ref https://stackoverflow.com/a/59681620/12278028
  const [isInGame, setIsInGame] = useState(false);

  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [wpm, setWpm] = useState<string>("");

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
    const word = GenerateWord();

    setUserInput("");
    setUserScore((prevUserScore) => (prevUserScore += 1));

    while (true) {
      if (doneWords.includes(word)) {
        continue;
      } else {
        setCurrentWord(word);
        setDoneWords((prevWords) => [...prevWords, word]);

        break;
      }
    }
  };

  const handleStartGame = () => {
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
    setGameTime(gameInitialTimeInMs);

    setUserInput("");
    setUserScore(0);
    setCurrentWord("");
    setDoneWords([]);
    setIsInGame(false);

    setStartTime(undefined);
    setWpm("");

    // Update high score
  };

  useEffect(() => {
    if (!startTime) {
      setStartTime(CurrentTime());
    }

    if (!isInGame && userInput.toLowerCase() === "start") {
      handleStartGame();
    }

    if (isInGame && userInput.trim() === currentWord) {
      if (startTime) {
        const durationInMinutes = (CurrentTime() - startTime) / 60000.0;

        setWpm(((doneWords.length + 1) / durationInMinutes).toFixed(2));
      }

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
    <div className={styles.container}>
      {isInGame ? (
        <Countdown
          date={Date.now() + gameTime}
          intervalDelay={0}
          precision={3}
          renderer={GameTime}
        />
      ) : (
        <p>{gameInitialTimeInMs / 1000.0}:00</p> // @ref https://stackoverflow.com/a/14090907/12278028
      )}

      {!isInGame && <h2>Enter "start" to begin</h2>}

      {isInGame && <h4>{currentWord}</h4>}

      <input
        type="text"
        placeholder={isInGame ? currentWord : "start"}
        value={userInput}
        onChange={({ target }) => setUserInput(target.value)}
        onPaste={(e) => {
          e.preventDefault();
          return false;
        }}
        autoComplete="false"
      />

      {isInGame && (
        <>
          <p>Score: {userScore}</p>
          <p>WPM: {wpm}</p>
        </>
      )}
    </div>
  );
};

export default Home;

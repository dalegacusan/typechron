import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { GenerateWord } from "../utils/words";
import { useEffect, useState } from "react";

const gameInitialTime = 10;

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [doneWords, setDoneWords] = useState<Array<string>>([]);
  const [gameTime, setGameTime] = useState<number>(gameInitialTime); // in seconds
  const [gameTimeIntervalId, setGameTimeIntervalId] =
    useState<ReturnType<typeof setInterval>>(); // @ref https://stackoverflow.com/a/59681620/12278028
  const [isInGame, setIsInGame] = useState(false);

  const handleAdditionalGameTime = () => {
    // 1 in 10 chance to get extra 2 seconds
    const r = Math.floor(Math.random() * 10);

    if (r === 0) {
      setGameTime((prevGameTime) => (prevGameTime += 2));

      return;
    }

    // Get 1 second every round by default
    setGameTime((prevGameTime) => (prevGameTime += 1));
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

        break;
      }
    }
  };

  const handleStartGame = () => {
    setIsInGame(true);
    handleInitiateRound();

    const gameTimeInterval = setInterval(() => {
      setGameTime((prevGameTime) => (prevGameTime -= 1));
    }, 1000);

    setGameTimeIntervalId(gameTimeInterval);
  };

  const handleEndGame = () => {
    if (gameTimeIntervalId) {
      clearInterval(gameTimeIntervalId);
    }

    setGameTimeIntervalId(undefined);
    setGameTime(gameInitialTime);

    setUserInput("");
    setUserScore(0);
    setCurrentWord("");
    setDoneWords([]);
    setIsInGame(false);

    // Update high score
  };

  useEffect(() => {
    if (!isInGame && userInput.toLowerCase() === "start") {
      handleStartGame();
    }

    if (isInGame && userInput.trim() === currentWord) {
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
      <p>{gameTime}s</p>

      {!isInGame && <h2>Enter "start" to begin</h2>}

      {isInGame && <h4>{currentWord}</h4>}

      <input
        type="text"
        placeholder={isInGame ? currentWord : "start"}
        value={userInput}
        onChange={({ target }) => setUserInput(target.value)}
      />

      {isInGame && (
        <>
          <p>Score: {userScore}</p>
        </>
      )}
    </div>
  );
};

export default Home;

import { Code, Paper, Text } from "@mantine/core";
import React from "react";

interface CurrentWordProps {
  word: string;
  userInput: string;
  isInGame: boolean;
}

const CurrentWord = (props: CurrentWordProps) => {
  const { isInGame, userInput, word } = props;
  const wordArray = word.split("");

  return (
    <Paper p="md">
      {isInGame ? (
        <>
          {wordArray.map((char, idx) => {
            let color;

            // Check if there is still something to compare
            // @ref https://youtu.be/2VGUGpZFY5s?t=722
            if (idx < userInput.length) {
              color = char === userInput[idx] ? "green" : "red";
            }

            return (
              <Text
                key={idx}
                component="span"
                size="xl"
                weight="bold"
                className={`${color}`}
              >
                {char}
              </Text>
            );
          })}
        </>
      ) : (
        <Text size="xl" weight="bold">
          Type <Code>start</Code> to begin
        </Text>
      )}
    </Paper>
  );
};

export default CurrentWord;

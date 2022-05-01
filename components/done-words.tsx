import { Text } from "@mantine/core";
import React from "react";

interface DoneWordsProps {
  words: string[];
}

const DoneWords = (props: DoneWordsProps) => {
  const { words } = props;

  return (
    <>
      {words.map((word: string, idx: number) => {
        const isNewWord = words.length - 1 === idx;
        const withComma = words.length - 2 === idx;

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
    </>
  );
};

export default DoneWords;

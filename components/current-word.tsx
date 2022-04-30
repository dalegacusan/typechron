import React from "react";

interface CurrentWordProps {
  word: string;
  userInput: string;
}

const CurrentWord = (props: CurrentWordProps) => {
  const wordArray = props.word.split("");

  return (
    <div>
      {wordArray.map((char, idx) => {
        let color;

        if (idx < props.userInput.length) {
          color = char === props.userInput[idx] ? "correct" : "incorrect";
        }

        return (
          <span key={idx} className={`${color}`}>
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default CurrentWord;

import RandomWords from "random-words";

export const GenerateWord = (): string => {
  return RandomWords({ exactly: 1, maxLength: 24 }).join("");
};

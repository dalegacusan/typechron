import RandomWords from "random-words";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export const GenerateWord = (): string => {
  return RandomWords({ exactly: 1, maxLength: 24 }).join("");
};

export const GenerateUsername = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
  });

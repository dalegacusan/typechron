import RandomWords from "random-words";
import {
  animals,
  colors,
  uniqueNamesGenerator,
  NumberDictionary,
} from "unique-names-generator";

export const GenerateWord = (): string => {
  return RandomWords({ exactly: 1, maxLength: 24 }).join("");
};

export const GenerateUsername = () => {
  const randomNumber = NumberDictionary.generate({ min: 100, max: 999 });

  return uniqueNamesGenerator({
    dictionaries: [animals, colors, randomNumber],
    length: 3,
    separator: "",
    style: "capital",
  });
};

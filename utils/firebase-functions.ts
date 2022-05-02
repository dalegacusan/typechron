import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { firebaseDb } from "../config/firebase-app";
import { GenerateWord } from "./words";
import { Game } from "../interfaces/game.interface";
import { User } from "../interfaces/user.interface";
import { v4 as uuidv4 } from "uuid";

export const getOneUserById = async (id: string) => {
  const usersRef = collection(firebaseDb, "users");
  const q = query(usersRef, where("id", "==", id));
  const userSnap = await getDocs(q);

  if (userSnap.docs.length !== 1) {
    return;
  }

  return userSnap.docs[0].data();
};

export const getGames = async (docsLimit: number) => {
  const gamesRef = collection(firebaseDb, "games");
  const q = query(gamesRef, orderBy("points", "desc"), limit(docsLimit));

  const gamesSnap = await getDocs(q);

  return gamesSnap.docs.map((game) => {
    return game.data();
  });
};

export const getGamesByUserId = async (id: string, docsLimit: number) => {
  const gamesRef = collection(firebaseDb, "games");
  const q = query(
    gamesRef,
    where("user.id", "==", id), // @ref https://stackoverflow.com/a/62626994/12278028
    orderBy("dateCreated", "desc"),
    limit(docsLimit)
  );
  const gamesSnap = await getDocs(q);

  return gamesSnap.docs.map((game) => {
    return game.data();
  });
};

export const getGamesWithPaginationByUserId = async (
  id: string,
  docsLimit: number,
  key?: number
) => {
  // @ref https://stackoverflow.com/a/69036032/12278028
  const constraints = [
    where("user.id", "==", id), // @ref https://stackoverflow.com/a/62626994/12278028
    orderBy("dateCreated", "desc"),
  ];

  if (key) {
    constraints.push(startAfter(key));
  } else {
    constraints.push(limit(docsLimit));
  }

  const gamesRef = collection(firebaseDb, "games");
  const q = query(gamesRef, ...constraints);
  const gamesSnap = await getDocs(q);

  let lastKey;

  const games = gamesSnap.docs.map((game) => {
    lastKey = game.data().dateCreated;

    return game.data();
  });

  return {
    games,
    lastKey,
  };
};

export const createUser = async (
  id: string,
  email: string,
  username?: string
) => {
  const randomWord = GenerateWord();
  const capitalizedFirstLetter =
    randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
  const defaultUsername = "Guest " + capitalizedFirstLetter;

  const newUser: User = {
    id,
    email,
    username: defaultUsername,
    dateCreated: new Date(),
  };

  if (username) {
    newUser.username = username;
  }

  await addDoc(collection(firebaseDb, "users"), newUser);

  return newUser;
};

export const createGame = async (game: Game) => {
  const newGame: Game = {
    id: uuidv4(),
    user: game.user,
    round: game.round,
    points: game.points,
    wpm: game.wpm,
    words: game.words,
    dateCreated: Date.now(),
  };

  await addDoc(collection(firebaseDb, "games"), newGame);

  return newGame;
};

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "../config/firebase-app";
import { Game } from "../interfaces/game.interface";
import { User } from "../interfaces/user.interface";

// Users
// ================

export const GetUser = async (userId: string) => {
  const userRef = doc(firebaseDb, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return {
      user: undefined,
    };
  }

  return {
    user: userSnap.data(),
  };
};

export const CreateUser = async (user: User) => {
  await setDoc(doc(firebaseDb, "users", user.id), user);

  return {
    user,
  };
};

export const UpdateUser = async (userId: string, dataToBeUpdated: any) => {
  const usersRef = doc(firebaseDb, "users", userId);

  await updateDoc(usersRef, dataToBeUpdated);
};

// Games
// ================

export const GetGames = async (constraints: Array<any>) => {
  const gamesRef = collection(firebaseDb, "games");
  const q = query(gamesRef, ...constraints);
  const gamesSnap = await getDocs(q);

  // If there are no more docs, "lastKey" will be undefined.
  // If this is undefined, it's an indicator to the frontend that
  // there are no more available records.
  // @ref https://dev.to/hadi/infinite-scroll-in-firebase-firestore-and-react-js-55g3
  let lastKey;
  const games: any = [];

  // @ref https://stackoverflow.com/a/37576787/12278028
  for (const game of gamesSnap.docs) {
    lastKey = game.data().dateCreated;

    const { user } = await GetUser(game.data().userId);

    // Filter user data
    const { userId, ...gameData } = game.data();
    //@ts-ignore
    const { email, dateCreated, highestScoringGame, ...userData } = user;

    games.push({
      ...gameData,
      id: game.id,
      user: userData,
    });
  }

  return {
    games,
    lastKey,
  };
};

export const CreateGame = async (game: Game) => {
  const newGame = await addDoc(collection(firebaseDb, "games"), game);

  return {
    game: {
      id: newGame.id,
      ...game,
    },
  };
};

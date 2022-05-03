import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { firebaseDb } from "../config/firebase-app";
import { Game } from "../interfaces/game.interface";
import { User } from "../interfaces/user.interface";

// Users
// ================

export const GetUser = async (constraints: Array<any>) => {
  const usersRef = collection(firebaseDb, "users");
  const q = query(usersRef, ...constraints);
  const userSnap = await getDocs(q);

  if (userSnap.docs.length !== 1) {
    return {
      user: undefined,
    };
  }

  return {
    user: userSnap.docs[0].data(),
  };
};

export const CreateUser = async (user: User): Promise<{ user: User }> => {
  await addDoc(collection(firebaseDb, "users"), user);

  return {
    user,
  };
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
  const games = gamesSnap.docs.map((game) => {
    lastKey = game.data().dateCreated;

    return game.data();
  });

  return {
    games,
    lastKey,
  };
};

export const CreateGame = async (game: Game): Promise<{ game: Game }> => {
  await addDoc(collection(firebaseDb, "games"), game);

  return {
    game,
  };
};

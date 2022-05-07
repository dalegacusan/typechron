import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firebaseDb } from "../config/firebase-app";
import { Game } from "../interfaces/game.interface";
import { User } from "../interfaces/user.interface";
import { DatabaseCollection } from "./api/enums/database-collection.enum";
import { QueryOrderDirection } from "./api/enums/query-order-direction.enum";

// ================
// Users
// ================

export const GetUser = async (userId: string) => {
  let user: DocumentData | null;

  try {
    const userRef = doc(firebaseDb, DatabaseCollection.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        user: null,
      };
    }

    user = userSnap.data();
  } catch (err) {
    user = null;
  }

  return {
    user,
  };
};

// @ref https://stackoverflow.com/a/69765347/12278028
export const GetUserByUsername = async (username: string) => {
  let user: DocumentData | null = null;

  try {
    const usersRef = collection(firebaseDb, DatabaseCollection.USERS);
    const q = query(
      usersRef,
      where("lowercaseUsername", "==", username.toLowerCase())
    );
    const usersSnap = await getDocs(q);

    if (usersSnap.docs.length > 0) {
      user = usersSnap.docs[0].data();
    }
  } catch (err) {
    user = null;
  }

  return {
    user,
  };
};

export const CreateUser = async (user: User) => {
  let newUser: User | null = user;

  try {
    await setDoc(doc(firebaseDb, DatabaseCollection.USERS, user.id), user);
  } catch (err) {
    newUser = null;
  }

  return {
    user: newUser,
  };
};

export const UpdateUser = async (userId: string, dataToBeUpdated: any) => {
  let updatedUser = null;

  try {
    const usersRef = doc(firebaseDb, DatabaseCollection.USERS, userId);
    await updateDoc(usersRef, dataToBeUpdated);

    updatedUser = { id: userId };
  } catch (err) {
    updatedUser = null;
  }

  return {
    user: updatedUser,
  };
};

// ================
// Games
// ================

export const GetGames = async (constraints: Array<any>) => {
  const gamesRef = collection(firebaseDb, DatabaseCollection.GAMES);
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

    // Filter user data
    const { userId, ...gameData } = game.data();

    games.push({
      ...gameData,
      id: game.id,
      user: {
        id: userId,
      },
    });
  }

  return {
    games,
    lastKey,
  };
};

export const CreateGame = async (
  game: Game | DocumentData,
  dbCollection: DatabaseCollection
) => {
  let newGame: DocumentData | null = null;

  try {
    let gameDoc, gameId;

    gameDoc = await addDoc(collection(firebaseDb, dbCollection), game);

    gameId = gameDoc.id;

    newGame = {
      id: gameId,
      ...game,
    };
  } catch (err) {
    newGame = null;
  }

  return {
    game: newGame,
  };
};

// ================
// Leaderboard
// ================

export const GetLeaderboardGames = async () => {
  const leaderboardGamesRef = collection(
    firebaseDb,
    DatabaseCollection.LEADERBOARD
  );
  const q = query(
    leaderboardGamesRef,
    orderBy(
      "score",
      QueryOrderDirection.DESC.toLowerCase() as OrderByDirection
    ),
    limit(10)
  );
  const leaderboardGamesSnap = await getDocs(q);

  const games: any = [];

  leaderboardGamesSnap.docs.forEach((game) =>
    games.push({ ...game.data(), id: game.id })
  );

  return {
    games,
  };
};

export const DeleteLeaderboardGame = async (gameId: string) => {
  try {
    await deleteDoc(doc(firebaseDb, DatabaseCollection.LEADERBOARD, gameId));
  } catch (err) {}
};

// @ref https://stackoverflow.com/a/58825593/12278028
// @ref https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
export const UpdateLeaderboardUsernames = async (
  userId: string,
  username: string
) => {
  const leaderboardGamesRef = collection(
    firebaseDb,
    DatabaseCollection.LEADERBOARD
  );
  const q = query(leaderboardGamesRef, where("userId", "==", userId));
  const leaderboardGamesSnap = await getDocs(q);

  const lbGamesBatch = writeBatch(firebaseDb);

  leaderboardGamesSnap.docs.forEach((tempDoc) => {
    const lbGameRef = doc(
      firebaseDb,
      DatabaseCollection.LEADERBOARD,
      tempDoc.id
    );

    lbGamesBatch.update(lbGameRef, { username });
  });

  await lbGamesBatch.commit();
};

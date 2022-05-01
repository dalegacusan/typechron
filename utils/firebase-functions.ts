import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "../config/firebase-app";
import { GenerateWord } from "./words";
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

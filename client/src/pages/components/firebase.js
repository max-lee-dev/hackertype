import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8REai_maBKqw882b90K2LEDunwOpNkoM",
  authDomain: "hackertype-directory.firebaseapp.com",
  projectId: "hackertype-directory",
  storageBucket: "hackertype-directory.appspot.com",
  messagingSenderId: "631721304818",
  appId: "1:631721304818:web:0d3653f8f407bb5c0ce66b",
  measurementId: "G-HSM9DBC9SN",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

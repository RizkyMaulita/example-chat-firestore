import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "your api key",
  authDomain: "your domain",
  projectId: "your projectId",
  storageBucket: "your storage bucket",
  messagingSenderId: "your messaging sender id",
  appId: "your app id",
  measurementId: "your measurementId",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

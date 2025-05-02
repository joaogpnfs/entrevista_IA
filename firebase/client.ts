// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCM4bCMxligA4XwSFYNSVQcorWQy7pW2Y",
  authDomain: "preptalk-cb2f2.firebaseapp.com",
  projectId: "preptalk-cb2f2",
  storageBucket: "preptalk-cb2f2.firebasestorage.app",
  messagingSenderId: "863852552434",
  appId: "1:863852552434:web:94493354b17fc074b5f06b",
  measurementId: "G-SQ1RVB471L",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

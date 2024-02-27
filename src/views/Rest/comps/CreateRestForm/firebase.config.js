// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJzYjc2TgQWFnw-0Kj3H2GTf9Jc3ojESw",
  authDomain: "otp-verification-375ea.firebaseapp.com",
  projectId: "otp-verification-375ea",
  storageBucket: "otp-verification-375ea.appspot.com",
  messagingSenderId: "189449013874",
  appId: "1:189449013874:web:80c8974db2bdfb540850eb",
  measurementId: "G-M7B40FKMR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
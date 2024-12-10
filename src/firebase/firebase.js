// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgzhRoEkvE-T_US_MUKHS9HOVheCWgrQY",
  authDomain: "player-skill-tracker.firebaseapp.com",
  projectId: "player-skill-tracker",
  storageBucket: "player-skill-tracker.firebasestorage.app",
  messagingSenderId: "114976051069",
  appId: "1:114976051069:web:19c6e018b9e284124b4614",
  measurementId: "G-52LD0XS4WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export { app, auth };
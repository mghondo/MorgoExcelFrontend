// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
apiKey: "AIzaSyDZIxxBk9YKyjU-Z3oNPf4wdM_2ANdSqyI",
authDomain: "morgoverdant.firebaseapp.com",
projectId: "morgoverdant",
storageBucket: "morgoverdant.firebasestorage.app",
messagingSenderId: "531578682004",
appId: "1:531578682004:web:9dda0d1793699125de5281",
measurementId: "G-8FMM1W0BD8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

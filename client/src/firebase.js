import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult,signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBop61MHgdReys8xIku5AVIUB1_1TGAdTA",
  authDomain: "todo-b45c3.firebaseapp.com",
  projectId: "todo-b45c3",
  storageBucket: "todo-b45c3.appspot.com",
  messagingSenderId: "52771659392",
  appId: "1:52771659392:web:3f3f39e642460d76ce9065",
  measurementId: "G-3GL5V91C6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("Firebase initialized");

export { auth, provider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut };


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvV8t5aEmH3Gc7EF0HzMW2JyAWgqkJd-A",
  authDomain: "chart-pulse.firebaseapp.com",
  projectId: "chart-pulse",
  storageBucket: "chart-pulse.firebasestorage.app",
  messagingSenderId: "19354522439",
  appId: "1:19354522439:web:3a7cefc6ff9a7ef5743262",
  measurementId: "G-KJRVZQNP79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, analytics };

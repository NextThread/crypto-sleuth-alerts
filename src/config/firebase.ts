
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCylfX9CAJbUZr7hr-IeR5IiAz8DYqahUY",
  authDomain: "chartpulse-team.firebaseapp.com",
  projectId: "chartpulse-team",
  storageBucket: "chartpulse-team.firebasestorage.app",
  messagingSenderId: "980653845524",
  appId: "1:980653845524:web:52202027b3d5d0b13b0b01",
  measurementId: "G-36488GC8YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, analytics };

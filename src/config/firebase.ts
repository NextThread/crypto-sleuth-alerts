
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMIxpPY0WVn0jw77XJDtMBW60lSdBeKbs",
  authDomain: "market-mirror-insights.firebaseapp.com",
  projectId: "market-mirror-insights",
  storageBucket: "market-mirror-insights.firebasestorage.app",
  messagingSenderId: "771585766449",
  appId: "1:771585766449:web:d6db4431d3a3b3009f9110",
  measurementId: "G-E3MW1QSD68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };

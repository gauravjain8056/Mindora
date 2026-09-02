// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mindora-4e72e.firebaseapp.com",
  projectId: "mindora-4e72e",
  storageBucket: "mindora-4e72e.firebasestorage.app",
  messagingSenderId: "934927922044",
  appId: "1:934927922044:web:dcdea8669da0f8064beaf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
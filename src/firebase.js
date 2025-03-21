// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI4-BnlhJz5BQflocmopqpEIsc6WoHiE0",
  authDomain: "ecomist-3082f.firebaseapp.com",
  databaseURL: "https://ecomist-3082f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecomist-3082f",
  storageBucket: "ecomist-3082f.appspot.com",
  messagingSenderId: "1054000421761",
  appId: "1:1054000421761:web:4a79a37b3b2fef9b996680",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(firebaseApp); // Authentication
export const provider = new GoogleAuthProvider(); // Google Sign-In Provider
export const db = getFirestore(firebaseApp); // Firestore Database
export const rdb = getDatabase(firebaseApp); // Realtime Database
export const storage = getStorage(firebaseApp); // Storage


// Function for Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
};

// Function to Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

export { ref, onValue };
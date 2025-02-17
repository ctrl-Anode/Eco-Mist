import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Your Firebase configuration (Replace with actual values if necessary)
const firebaseConfig = {
  apiKey: "AIzaSyDI4-BnlhJz5BQflocmopqpEIsc6WoHiE0",
  authDomain: "ecomist-3082f.firebaseapp.com",
  projectId: "ecomist-3082f",
  storageBucket: "ecomist-3082f.appspot.com",
  messagingSenderId: "1054000421761",
  appId: "1:1054000421761:web:4a79a37b3b2fef9b996680",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); 

// Function for Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
};

// Function to Logout
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

export { auth, db, storage, signInWithGoogle, logout };

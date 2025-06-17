// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage, getToken } from "firebase/messaging"; // Ensure `onMessage` is imported
import axios from "axios"; // For making HTTP requests to an SMS API

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI4-BnlhJz5BQflocmopqpEIsc6WoHiE0",
  authDomain: "ecomist-3082f.firebaseapp.com",
  databaseURL: "https://ecomist-3082f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecomist-3082f",
  storageBucket: "ecomist-3082f.firebasestorage.app",
  messagingSenderId: "1054000421761",
  appId: "1:1054000421761:web:4a79a37b3b2fef9b996680",
};

// Export firebaseConfig
export { firebaseConfig };

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(firebaseApp); // Authentication
export const provider = new GoogleAuthProvider(); // Google Sign-In Provider
export const db = getFirestore(firebaseApp); // Firestore Database
export const rdb = getDatabase(firebaseApp); // Realtime Database
export const storage = getStorage(firebaseApp); // Ensure Storage is initialized
export const messaging = getMessaging(firebaseApp); // Initialize Firebase Messaging

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

// Function to request FCM token
export const requestFcmToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "BLcoKHiPfFAMCNTzgqzgo3IXUQNpENK9NKaT-pMOv46ejmxujlFNKNnGXujiAMDdq2K4tYkMydNFu8_lfWcjKLw" });
    if (token) {
      console.log("FCM Token received: [TOKEN REDACTED]"); // Updated log message
      return token;
    } else {
      console.warn("No FCM token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Ensure `onMessageListener` is correctly defined
export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        resolve(payload);
      });
    } catch (error) {
      console.error("Error in onMessageListener:", error);
      reject(error);
    }
  });

// Function to send SMS notification
export const sendSmsNotification = async (phoneNumber, message) => {
  try {
    const response = await axios.post("https://sms-api.example.com/send", {
      to: phoneNumber,
      message: message
    });
    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

// Function to send FCM notification
export const sendFcmNotification = async (fcmToken, title, body) => {
  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=YOUR_SERVER_KEY` // Replace with your Firebase server key
      },
      body: JSON.stringify({
        to: fcmToken,
        notification: {
          title: title,
          body: body
        }
      })
    });

    if (response.ok) {
      console.log("FCM notification sent successfully");
    } else {
      console.error("Error sending FCM notification:", await response.text());
    }
  } catch (error) {
    console.error("Error sending FCM notification:", error.message);
  }
};

export { ref, onValue, set };
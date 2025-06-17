importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/eco-mist-logo.png", // Replace with your app's icon
  });
});

// Run this script with Node.js to create an admin user
// Usage: node create-admin.js <userId>

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdminUser(userId) {
  if (!userId) {
    console.error('Please provide a user ID');
    process.exit(1);
  }

  try {
    // Check if user document exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date()
      });
      console.log(`User ${userId} has been updated to admin role`);
    } else {
      // Create new user document
      await setDoc(userRef, {
        role: 'admin',
        createdAt: new Date(),
        isActive: true
      });
      console.log(`User ${userId} has been created with admin role`);
    }
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];
createAdminUser(userId);
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

/**
 * Get the current user with enhanced properties including admin status
 * @returns {Promise<Object|null>} Enhanced user object or null if not authenticated
 */
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        // Get the user's custom claims and roles
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Enhance the user object with the Firestore data
            resolve({
              ...user,
              isAdmin: userData.role === 'admin',
              role: userData.role || 'user',
              userData: userData
            });
          } else {
            // User is authenticated but has no Firestore document
            resolve({
              ...user,
              isAdmin: false,
              role: 'user',
              userData: null
            });
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          // Still resolve with the user but mark as non-admin
          resolve({
            ...user,
            isAdmin: false,
            role: 'user',
            error: error.message
          });
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
};

/**
 * Check if the current user has admin privileges
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export const checkIsAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Create a composable for Vue to use authentication
 * @returns {Object} Auth utilities
 */
export const useAuth = () => {
  const checkAuth = async () => {
    const user = await getCurrentUser();
    return {
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      user
    };
  };

  return {
    getCurrentUser,
    checkIsAdmin,
    checkAuth
  };
};
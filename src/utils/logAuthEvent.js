// src/utils/logAuthEvent.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const logAuthEvent = async ({
  type,        // "login" | "register"
  status,      // "success" | "failed"
  email,
  reason = null, // e.g., "email-not-verified", "wrong-password"
  uid = null,
}) => {
  try {
    await addDoc(collection(db, "auth_logs"), {
      type,
      status,
      email,
      reason,
      uid,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Logging failed:", error);
  }
};

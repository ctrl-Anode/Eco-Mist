import { getAuth } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

/**
 * Logs user activity in Firestore
 * @param {string} action - The action performed
 * @param {string} section - The section where the action was performed
 * @param {Object} details - Additional details about the action
 */
export const logActivity = async (action, section, details = {}) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) return

    await addDoc(collection(db, "activityLogs"), {
      userId: user.uid,
      userEmail: user.email,
      action,
      section,
      details,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    })

    console.log("Activity logged:", action, section)
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

/**
 * Logs settings changes
 * @param {string} settingType - Type of setting (account, notification, appearance, system)
 * @param {Object} changes - The changes made
 */
export const logSettingsChange = async (settingType, changes) => {
  await logActivity("update_settings", settingType, { changes })
}


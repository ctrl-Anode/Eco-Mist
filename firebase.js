async function requestFcmToken() {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('No FCM token received. User may have blocked notifications.');
    }
  } catch (error) {
    if (error.code === 'messaging/permission-blocked') {
      console.error('Notification permission was blocked. Please enable it in browser settings.');
    } else {
      console.error('Error getting FCM token:', error);
    }
  }
}

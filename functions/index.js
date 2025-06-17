const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.database();
const messaging = admin.messaging();

// Configuration: number of consecutive breaches before notification
const BREACH_THRESHOLD_COUNT = 3;

// Helper function to check if value is outside threshold range
function isValueOutsideThreshold(value, min, max) {
  if (value === undefined || value === null) return false;
  return value < min || value > max;
}

// Cloud Function triggered on sensor data changes
exports.notifyThresholdBreaches = functions.database.ref('/sensor_data/{pushId}')
  .onCreate(async (snapshot, context) => {
    const sensorData = snapshot.val();
    if (!sensorData) return null;

    // Get all device thresholds from /thresholds node
    const thresholdsSnapshot = await db.ref('/thresholds').once('value');
    const thresholdsData = thresholdsSnapshot.val() || {};

    // For simplicity, assume one device or use first device thresholds
    // In real scenario, sensorData should include deviceId to match thresholds
    const deviceIds = Object.keys(thresholdsData);
    if (deviceIds.length === 0) return null;

    const deviceId = deviceIds[0];
    const thresholds = thresholdsData[deviceId];

    if (!thresholds) return null;

    // Check each sensor parameter for threshold breach
    const breachedParams = [];

    for (const param in sensorData) {
      if (!thresholds.hasOwnProperty(param + '_min') || !thresholds.hasOwnProperty(param + '_max')) {
        continue;
      }
      const min = thresholds[param + '_min'];
      const max = thresholds[param + '_max'];
      const value = sensorData[param];

      if (isValueOutsideThreshold(value, min, max)) {
        breachedParams.push({ param, value, min, max });
      }
    }

    if (breachedParams.length === 0) {
      // No breaches, clear any breach count for this data point
      return null;
    }

    // Track breach counts in database to avoid spamming notifications
    const breachCountRef = db.ref(`/breach_counts/${deviceId}`);
    const breachCountsSnapshot = await breachCountRef.once('value');
    let breachCounts = breachCountsSnapshot.val() || {};

    // Update breach counts for breached params
    breachedParams.forEach(({ param }) => {
      breachCounts[param] = (breachCounts[param] || 0) + 1;
    });

    // Reset counts for params not breached
    for (const param in breachCounts) {
      if (!breachedParams.find(b => b.param === param)) {
        breachCounts[param] = 0;
      }
    }

    // Save updated breach counts
    await breachCountRef.set(breachCounts);

    // Determine which params have reached threshold count
    const paramsToNotify = breachedParams.filter(({ param }) => breachCounts[param] >= BREACH_THRESHOLD_COUNT);

    if (paramsToNotify.length === 0) {
      // No params reached notification threshold yet
      return null;
    }

    // Compose notification message
    const notificationTitle = 'Sensor Threshold Alert';
    const notificationBody = paramsToNotify.map(({ param, value, min, max }) => {
      return `${param} value ${value} is outside range (${min} - ${max})`;
    }).join('; ');

    // Get FCM tokens from /fcm_tokens node (assumed structure)
    const tokensSnapshot = await db.ref('/fcm_tokens').once('value');
    const tokensData = tokensSnapshot.val() || {};
    const tokens = Object.values(tokensData);

    if (tokens.length === 0) {
      console.log('No FCM tokens available for notifications');
      return null;
    }

    // Prepare message payload
    const message = {
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      tokens: tokens,
    };

    // Send notifications
    try {
      const response = await messaging.sendMulticast(message);
      console.log('Notifications sent:', response.successCount, 'successes,', response.failureCount, 'failures');

      // Optionally, clear breach counts for notified params to avoid repeated notifications
      paramsToNotify.forEach(({ param }) => {
        breachCounts[param] = 0;
      });
      await breachCountRef.set(breachCounts);

      return null;
    } catch (error) {
      console.error('Error sending notifications:', error);
      return null;
    }
  });

export const trackEvent = (eventName, eventData) => {
  if (window.gtag) {
    window.gtag("event", eventName, eventData);
  } else {
    console.log(`Analytics Event: ${eventName}`, eventData); // Fallback for debugging
  }
};

import { getAuth } from "firebase/auth";

const rateLimiter = (() => {
  const attempts = new Map();

  return (email) => {
    const now = Date.now();
    const limit = 5; // Max attempts
    const windowMs = 15 * 60 * 1000; // 15 minutes

    if (!attempts.has(email)) {
      attempts.set(email, []);
    }

    const timestamps = attempts.get(email).filter((timestamp) => now - timestamp < windowMs);
    timestamps.push(now);

    attempts.set(email, timestamps);

    if (timestamps.length > limit) {
      throw new Error("Too many login attempts. Please try again later.");
    }
  };
})();

export const enforceRateLimit = (email) => {
  rateLimiter(email);
};

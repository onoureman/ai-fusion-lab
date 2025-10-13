import arcjet from "@arcjet/next"; 
import { tokenBucket } from "@arcjet/next";




// Initialize Arcjet with your site key and rate limiting rules

export const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      characteristics: ["userId"], // track requests by a custom user ID
      refillRate: 5, // refill 5 tokens per interval
      interval: 5, // refill every 24 hours
      capacity: 5, // bucket maximum capacity of 5 tokens
    }),
  ],
});
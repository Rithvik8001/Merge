import rateLimit from "express-rate-limit";

/**
 * Global rate limiter - Applied to all requests
 * 100 requests per 15 minutes per IP
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for GET requests to non-sensitive endpoints
    return req.method === "GET" && !req.path.includes("/profile/view");
  },
});

/**
 * Authentication rate limiter - Stricter limits for login/signup
 * 5 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message:
    "Too many authentication attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
  skipFailedRequests: false, // Count failed requests too
});

/**
 * Connection requests rate limiter
 * 20 requests per 15 minutes per IP
 */
export const connectionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message:
    "Too many connection requests, please try again after some time.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Chat rate limiter - STRICT: Very tight limits to prevent spam
 * 30 messages per 1 minute per IP
 * AND 100 messages per 15 minutes per IP
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute (about 1 message per 2 seconds)
  message:
    "Too many messages sent, please slow down. Maximum 30 messages per minute.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Stricter chat rate limiter for message sending specifically
 * Prevents rapid message spam
 */
export const chatMessageRateLimiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
  max: 1, // Only 1 message per second per IP (strict)
  message: "Please wait before sending another message.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Very strict rate limiter for typing events via Socket.io
 * 10 typing events per 5 seconds per user
 */
export const typingRateLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 10, // Limit to 10 typing events per 5 seconds
  message: "Typing indicator rate limit exceeded.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Profile rate limiter
 * 30 requests per 15 minutes per IP
 */
export const profileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: "Too many profile requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Feed rate limiter - Pagination requests
 * 50 requests per 15 minutes per IP
 */
export const feedRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: "Too many feed requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

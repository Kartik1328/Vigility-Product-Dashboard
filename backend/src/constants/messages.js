const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    INVALID_CREDENTIALS: "Invalid username or password",
    USERNAME_TAKEN: "Username already taken",
    UNAUTHORIZED: "Unauthorized - no token provided",
    INVALID_TOKEN: "Invalid or expired token",
  },
  TRACK: {
    SUCCESS: "Event tracked successfully",
  },
  ANALYTICS: {
    SUCCESS: "Analytics data fetched successfully",
  },
  VALIDATION: {
    FAILED: "Validation failed",
  },
  GENERAL: {
    SERVER_ERROR: "Internal server error",
    NOT_FOUND: "Route not found",
  },
};

export default MESSAGES;

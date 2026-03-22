import MESSAGES from "../constants/messages.js";

export const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: MESSAGES.GENERAL.SERVER_ERROR,
    errors: null,
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

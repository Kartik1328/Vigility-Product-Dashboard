import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import trackRoutes from "./routes/track.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// ── Routes ─────────────────────────────────────
app.use("/", authRoutes);
app.use("/track", trackRoutes);
app.use("/analytics", analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running", data: null });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    errors: null,
  });
});

// Global error handler — must be last
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

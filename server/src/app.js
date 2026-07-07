import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import recommendationsRoutes from './routes/recommendationsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import issuesRoutes from './routes/issuesRoutes.js';
import complaintsRoutes from './routes/complaintsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import meetingRoutes from './routes/meetings.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

connectDB();

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// preflight explicitly handle karo
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

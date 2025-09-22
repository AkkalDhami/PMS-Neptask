import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import hpp from 'hpp';
import helmet from 'helmet';

dotenv.config();

import { connectToDatabase } from './configs/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { safeSanitize } from './middlewares/safeSanitize.js';
import "./configs/google.js";
import "./jobs/orgCleanup.js";
// import "./jobs/taskRemainder.js";

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import orgRouter from './routes/orgRoutes.js';
import inviteRouter from './routes/inviteRoutes.js';
import workspaceRouter from './routes/workspaceRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import subtaskRouter from './routes/subtaskRoutes.js';
const app = express();

// Middleware
const rawCorsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawCorsOrigins.split(',').map((s) => s.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Set security headers
app.use(helmet());


// Prevent http param pollution
app.use(hpp());

app.use((req, res, next) => {
    res.locals.user = req.user;
    return next();
})

//? ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/invite', inviteRouter);

app.use('/api/org', orgRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/project', projectRouter);
app.use('/api/task', taskRouter); 
app.use('/api/task/subtask', subtaskRouter); 



app.get('/', (req, res) => {
    res.json({ status: 'ok', });
});

app.use((req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});

// Error handler
app.use(errorHandler);


connectToDatabase();

export default app;
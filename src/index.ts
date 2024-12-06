import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/todo.routes';
import AuthRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { userProtected } from './middleware/Protected';
dotenv.config();

const app = express();
const MONGO_URL: string = process.env.MONGO_URL || '';
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/api/auth', AuthRouter);
app.use('/api', userProtected, router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        message: 'Server Error',
        error: err.message,
    });
});
mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

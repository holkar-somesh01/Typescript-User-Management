import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/todo.routes';
import AuthRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { userProtected } from './middleware/Protected';
import path from 'path';
dotenv.config();

const app = express();
const MONGO_URL: string = process.env.MONGO_URL!
const PORT: number = parseInt(process.env.PORT!)

app.use(express.json())
app.use(cookieParser())
const distPath = path.join(__dirname, "..", "dist")
app.use(express.static(distPath))
app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/api/auth', AuthRouter);
app.use('/api', userProtected, router);
app.use('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, distPath, "index.html"))
    res.status(404).json({ message: "Resource Not Found" })

})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(500).json({ message: 'Server Error', error: err.message, })
})
mongoose.connect(MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(PORT, () => console.log(`SERVER RINNING 🏃‍♂️`))
})

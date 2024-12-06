import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

interface CustomRequest extends Request {
    cookies: {
        user?: string;
    };
    loggedInUser?: string;
}

export const userProtected = (req: CustomRequest, res: Response, next: NextFunction): any => {
    const { user } = req.cookies;

    if (!user) {
        return res.status(401).json({ message: "No Cookie Found" });
    }

    jwt.verify(user, process.env.JWT_KEY as string, (err: VerifyErrors | null, decode: any) => {
        if (err) {
            return res.status(401).json({ message: "JWT Error", error: err.message });
        }
        req.loggedInUser = decode.userId;
        next();
    });
};

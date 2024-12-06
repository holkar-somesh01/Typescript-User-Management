import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import User from "../model/User"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginSchema, registerSchema, updateSchema } from "../middleware/authValidation"
import dotenv from 'dotenv';
import cloudinary from "../utils/cloudinary.config"
import upload from "../utils/upload"
dotenv.config();


export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const paresData = registerSchema.parse(req.body)
    const { name, email, password } = paresData
    const isfound = await User.findOne({ email })
    if (isfound) {
        return res.status(400).json({ message: "User Alredy Registerd" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hash })
    res.json({ message: "Register Success" })
})

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const paresData = loginSchema.parse(req.body)
    const { email, password } = paresData
    const isfound = await User.findOne({ email })
    if (!isfound) {
        return res.status(400).json({ message: "USer Not Found" })
    }
    const verify = await bcrypt.compare(password, isfound.password)
    if (!verify) {
        return res.status(400).json({ message: "password Not match" })
    }
    const jwtKey: string = process.env.JWT_KEY || "defaultSecretKey";
    const Token = jwt.sign({ userId: isfound._id }, jwtKey, { expiresIn: "10d" })
    res.cookie('user', Token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    res.json({
        message: "User login Success", result: {
            _id: isfound._id,
            name: isfound.name,
            email: isfound.email,
            isActive: isfound.isActive,
        }
    })
})

export const updateprofile = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Multer Errrr", err })
        }
        const isActive = req.body.isActive === 'true';
        const paraseData = updateSchema.parse({ ...req.body, isActive })
        const { id } = req.params
        const { name, mobile, hobby, exprience, } = paraseData
        let images
        if (req.file) {
            cloudinary.uploader.upload(req.file.path)
                .then(async ({ secure_url }) => {
                    images = secure_url
                    await User.findByIdAndUpdate(id, { name, mobile, hobby, exprience, isActive, photo: images })
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send("Error uploading file.");
                });
        }
        res.json({ message: "Update Success" })
    })
})
export const fetchProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const result = await User.findOne({ _id: id })
    res.json({ message: "Fetch Success", result })
})
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("user")
    res.json({ message: "Logout Success" })
})
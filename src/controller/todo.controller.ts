import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Todo from "../model/Todo"
import upload from "../utils/upload"
import cloudinary from "../utils/cloudinary.config"
import path from "path"
import { updateTodoSchema } from "../middleware/authValidation"


interface ITodo {
    _id: string;
    title: string;
    description: string;
    photo?: string;
    priority: string;
    taskType: string;
    skills: string[];
    message: string;
    isCompleted: boolean;

}
interface CustomRequest extends Request {
    loggedInUser?: string; // or whatever type `loggedInUser` should be
}

export const getTodo = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    console.log(req.loggedInUser)
    const result = await Todo.find({ userId: req?.loggedInUser })
    res.json({ message: "Fetch Success", result })
})
export const addTodo = asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    upload(req, res, async (err) => {

        console.log("req.body", req.body);
        console.log("req.files", req.file);

        if (err) {
            return res.status(400).json({ message: "Multer Errrr", err })
        }
        const { title, description, isCompleted, priority, skills, taskType, message } = req.body
        let photo
        if (req.file) {
            try {
                const { secure_url } = await cloudinary.uploader.upload(req.file.path)
                photo = secure_url
                console.log("secure url", secure_url);

            } catch (error) {
                return res.status(500).json({ message: "cloudinary error", error })
            }
        }

        await Todo.create({ title, description, isCompleted, priority, skills, taskType, message, photo, userId: req.loggedInUser })
        res.json({ message: "todo create success" })
    })
})
export const deleteTodos = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Multer Error", err })
        }
        const { id } = req.params
        const result = await Todo.findById(id) as ITodo;
        if (!result) {
            return res.status(400).json({ message: "Data not found" })
        }
        if (result.photo) {
            cloudinary.uploader.destroy(path.basename(result?.photo))
                .then(async () => {
                    await Todo.findByIdAndDelete(id)
                    console.log("Delete Suucces")
                })
                .catch((err) => console.error(err)
                )
        }
        res.json({ message: "todo delete  succes" })
    })
})
export const updateTodos = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    upload(req, res, async (err) => {
        const paresData = updateTodoSchema.parse(req.body)
        const { title, description, isCompleted, priority, skills, taskType, message } = paresData
        console.log(req.body, "req-body")

        const { id } = req.params
        let photo
        if (req.file) {
            cloudinary.uploader.upload(req.file.path)
                .then(async ({ secure_url }) => {
                    photo = secure_url
                    await Todo.findByIdAndUpdate(id, { title, description, isCompleted, priority, skills, taskType, message, photo })
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send("Error uploading file.");
                });
        }
        res.json({ message: "todo Update  succes" })
    })
})
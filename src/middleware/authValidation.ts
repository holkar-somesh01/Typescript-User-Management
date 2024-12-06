import { z } from 'zod'
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})
export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})
export const updateSchema = z.object({
    mobile: z.string(),
    name: z.string(),
    hobby: z.string(),
    exprience: z.array(z.string()),
    isActive: z.boolean().optional(),
})
export const updateTodoSchema = z.object({
    title: z.string(),
    description: z.string(),
    isCompleted: z.string(),
    priority: z.string(),
    skills: z.string(),
    taskType: z.string(),
    message: z.string(),
})
import Router from 'express'
import { addTodo, deleteTodos, getTodo, updateTodos } from '../controller/todo.controller'
const router = Router.Router()

router
    .post("/add", addTodo)
    .get("/get", getTodo)
    .put("/update/:id", updateTodos)
    .delete("/delete/:id", deleteTodos)

export default router
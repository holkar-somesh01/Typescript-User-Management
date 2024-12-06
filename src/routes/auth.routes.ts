import Router from 'express'
import { fetchProfile, loginUser, logout, registerUser, updateprofile } from '../controller/auth.controller'
import { userProtected } from '../middleware/Protected'
const AuthRouter = Router.Router()

AuthRouter
    .post("/register", registerUser)
    .post("/login", loginUser)
    .post("/logout", logout)
    .put("/update/:id", userProtected, updateprofile)
    .get("/fetch/:id", userProtected, fetchProfile)

export default AuthRouter
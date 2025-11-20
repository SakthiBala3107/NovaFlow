import { Router } from "express";
import { registerUser, loginUser, getMe, updateUser } from "../controllers/AuthController.js";
import AuthMiddleWare from "../middlewares/authMiddlewares.js";

 const authRouter = Router()

 authRouter.post('/register', registerUser)
 authRouter.post('/login', loginUser)

authRouter.route('/me').get(AuthMiddleWare, getMe).put(AuthMiddleWare, updateUser)

export default authRouter
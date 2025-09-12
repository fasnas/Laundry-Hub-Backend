import express from"express"
import { googleLogin, login, sendOTP } from "../controller/userController.js"
// import { authMiddleware } from "../middleware/authmiddleware.js"
import { register } from "../controller/userController.js"
import { GetAllLaundry, registerLaundry } from "../controller/laundryController.js"
import { verifyToken } from "../middleware/authmiddleware.js"

const authRouter=express.Router()

authRouter.post("/register",register)
authRouter.post("/otp",sendOTP)
authRouter.post("/login",login)
authRouter.post("/googlelogin",googleLogin)

export default authRouter
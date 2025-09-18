import express from"express"
import { forgotpassword, googleLogin, login, sendOTP, verifyOTP } from "../controller/userController.js"
// import { authMiddleware } from "../middleware/authmiddleware.js"
import { register } from "../controller/userController.js"
import { registerLaundry } from "../controller/laundryController.js"
import { verifyToken } from "../middleware/authmiddleware.js"

const authRouter=express.Router()

authRouter.post("/register",register)
authRouter.post("/otp",sendOTP)
authRouter.post("/login",login)
authRouter.post("/googlelogin",googleLogin)
authRouter.post("/verifyotp",verifyOTP)
authRouter.post("/forgotpassword",forgotpassword)

export default authRouter
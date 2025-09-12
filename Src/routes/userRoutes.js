import express from "express"
import { updateUserLocation } from "../controller/userController.js"
import { verifyToken } from "../middleware/authmiddleware.js"

const userRouter=express.Router()

userRouter.post("/locationupdate",verifyToken,updateUserLocation)
//not used now,model,route,controller exist.

export default userRouter
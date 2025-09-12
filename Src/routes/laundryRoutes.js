import express from "express"
import { GetAllLaundry, getLaundriesWithin50km, getLaundryItems, registerLaundry, updateLaundryItems } from "../controller/laundryController.js"
import { verifyToken } from "../middleware/authmiddleware.js"
import { getSingleLaundry } from "../controller/laundryController.js"

const laundryRouter=express.Router()

laundryRouter.post("/laundry",registerLaundry)
laundryRouter.get("/getalllaundry",GetAllLaundry)
laundryRouter.get("/getsinglelaundry/:id",getSingleLaundry)
laundryRouter.post("/getlaundarydistance",getLaundriesWithin50km)
laundryRouter.post("/itemupdate",verifyToken,updateLaundryItems)
laundryRouter.get("/getitems",verifyToken,getLaundryItems)

export default laundryRouter
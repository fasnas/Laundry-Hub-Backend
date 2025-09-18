import express from "express"
import { deleteitem, getLaundriesWithin50km, getLaundryItems, getLaundryOrders, registerLaundry, statusupdate, updateLaundryItems } from "../controller/laundryController.js"
import { verifyToken } from "../middleware/authmiddleware.js"
import { getSingleLaundry } from "../controller/laundryController.js"
import { authorisation } from "../middleware/authorisation.js"
import { addCoupon, deleteCoupon, getCoupon, togglecoupon } from "../controller/couponController.js"

const laundryRouter=express.Router()

laundryRouter.post("/laundry",registerLaundry)

laundryRouter.get("/getsinglelaundry/:id",getSingleLaundry)
laundryRouter.post("/getlaundarydistance",getLaundriesWithin50km)
laundryRouter.post("/itemupdate",authorisation,updateLaundryItems)  ////laundryside operation
laundryRouter.get("/getitems",verifyToken,getLaundryItems)      //laundryside operation
laundryRouter.get("/getlaundryorders",verifyToken,getLaundryOrders)
laundryRouter.delete("/deleteitems",verifyToken,deleteitem)
laundryRouter.post("/statusupdate",verifyToken,statusupdate)
laundryRouter.post("/addcoupon",verifyToken,addCoupon)
laundryRouter.get("/getcoupon",verifyToken,getCoupon)
laundryRouter.delete("/deletecoupon",verifyToken,deleteCoupon)
laundryRouter.patch("/togglecoupon",verifyToken,togglecoupon)

export default laundryRouter
import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { addAddress, getAddresses, selectAddress } from "../controller/adressController.js";
import { createOrder, getLaundryOrders, getMyOrders } from "../controller/orderController.js";

const addressRouter = express.Router();

addressRouter.get("/addresses", verifyToken, getAddresses);
addressRouter.post("/addresses/add", verifyToken, addAddress);
addressRouter.post("/addresses/select", verifyToken, selectAddress);
addressRouter.post("/createorder", verifyToken, createOrder);
addressRouter.get("/getorders", verifyToken, getMyOrders);

addressRouter.get("/orders/laundry/:laundryId", verifyToken, getLaundryOrders);  //for laundri admin side 

export default addressRouter




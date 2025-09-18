import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { addAddress, deleteAddress, getAddresses, selectAddress } from "../controller/adressController.js";
// import { getLaundryOrders } from "../controller/orderController.js";

const addressRouter = express.Router();

addressRouter.get("/addresses", verifyToken, getAddresses);
addressRouter.post("/addresses/add", verifyToken, addAddress);
addressRouter.post("/addresses/select", verifyToken, selectAddress);
addressRouter.delete("/addresses/delete", verifyToken, deleteAddress);


// addresses/delete
// addressRouter.get("/orders/laundry/:laundryId", verifyToken, getLaundryOrders);  //for laundri admin side 

export default addressRouter




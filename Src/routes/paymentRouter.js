import express from "express"
import { verifyToken } from "../middleware/authmiddleware.js"
import { createRazorpayOrder, getMyOrders, handlePaymentFailure, verifyPayment } from "../controller/orderController.js"

const PaymentRouter = express.Router()

PaymentRouter.post("/createorder", verifyToken, createRazorpayOrder)
PaymentRouter.post("/verifypayment", verifyToken, verifyPayment)
PaymentRouter.post("/paymentfailure", verifyToken, handlePaymentFailure)
PaymentRouter.get("/getorders", verifyToken, getMyOrders);

export default PaymentRouter
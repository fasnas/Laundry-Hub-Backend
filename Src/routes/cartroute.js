import express from "express";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  checkout,
  getCartforsummary,
} from "../controller/cartController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const cartRouter = express.Router();
cartRouter.post("/cart/:laundryId/add", verifyToken, addToCart);
cartRouter.get("/cart/:laundryId", verifyToken, getCart);
cartRouter.get("/cartsummary", verifyToken, getCartforsummary);//for summary page
cartRouter.patch("/cart/:laundryId/update", verifyToken, updateCartItemQuantity);
cartRouter.delete("/cart/:laundryId/remove", verifyToken, removeFromCart);
cartRouter.delete("/cart/:laundryId/clear", verifyToken, clearCart);
cartRouter.post("/cart/:laundryId/checkout", verifyToken, checkout);

export default cartRouter;

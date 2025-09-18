// import mongoose from "mongoose";
// import USER from "./userModel.js";
// import Laundry from "./laundrySchema.js";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, default: 1 },
// });

// const categorySchema = new mongoose.Schema({
//   categoryName: { type: String, required: true },
//   products: [productSchema],
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "USER", 
//       required: true 
//     },
    
//     // 🔹 Store laundry reference for order
//     laundry: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Laundry", 
//       required: true 
//     },
    
//     categories: [categorySchema],
    
//     totalPrice: { 
//       type: Number, 
//       required: true 
//     },
    
//     // 🔹 Store address ID (references embedded address in user document)
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
    
//     status: {
//       type: String,
//       enum: ["Ordered", "In Progress", "Shipped", "Delivered", "Cancelled"],
//       default: "Ordered",
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;




/////payment integrated schema is below/////////////////




import mongoose from "mongoose";
import USER from "./userModel.js";
import Laundry from "./laundrySchema.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  products: [productSchema],
});

// 🔹 Payment schema for storing payment details
const paymentSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ["Payment Pending","pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["razorpay", "cod", "wallet"],
    default: "razorpay"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  paidAt: {
    type: Date,
    default: null
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true
    },
    
    laundry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laundry",
      required: true
    },
    
    categories: [categorySchema],
    
    totalPrice: {
      type: Number,
      required: true
    },
    
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    
    status: {
      type: String,
      enum: ["Ordered", "Picked", "In Progress", "Ready", "Out For Delivery", "Completed"],
      default: "Ordered",
    },
    
    // 🔹 Add payment details
    payment: paymentSchema,
    
    // 🔹 Order notes (optional)
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
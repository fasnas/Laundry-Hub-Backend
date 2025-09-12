// import mongoose from "mongoose";
// import USER from "./userModel.js";

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
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
//     categories: [categorySchema], // copy from cart
//     totalPrice: { type: Number, required: true },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
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



// import mongoose from "mongoose";
// import USER from "./userModel.js";
// import Laundry from "./laundrySchema.js"; // 🔹 make sure you have a laundry model

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
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },

//     // 🔹 Store laundry reference for order
//     laundry: { type: mongoose.Schema.Types.ObjectId, ref: "Laundry", required: true },

//     categories: [categorySchema],
//     totalPrice: { type: Number, required: true },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
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
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
    
//     // 🔹 Store laundry reference for order
//     laundry: { type: mongoose.Schema.Types.ObjectId, ref: "Laundry", required: true },
    
//     categories: [categorySchema],
//     totalPrice: { type: Number, required: true },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
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

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "USER", 
      required: true 
    },
    
    // 🔹 Store laundry reference for order
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
    
    // 🔹 Store address ID (references embedded address in user document)
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    
    status: {
      type: String,
      enum: ["Ordered", "In Progress", "Shipped", "Delivered", "Cancelled"],
      default: "Ordered",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
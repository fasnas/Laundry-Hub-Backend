// import mongoose from "mongoose";
// import USER from "./userModel.js";


// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, default: 1 }
// });

// const categorySchema = new mongoose.Schema({
//   categoryName: { type: String, required: true },
//   products: [productSchema],
// });

// const cartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
//     categories: [categorySchema],
//     totalPrice: { type: Number, default: 0 }
//   },
//   { timestamps: true }
// );

// // 🔹 Utility method to recalc total price
// cartSchema.methods.calculateTotal = function () {
//   this.totalPrice = this.categories.reduce((total, category) => {
//     return total + category.products.reduce((catTotal, product) => {
//       return catTotal + product.price * product.quantity;
//     }, 0);
//   }, 0);
// };

// const Cart = mongoose.model("Cart", cartSchema);

// export default Cart;



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

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
    laundry: { type: mongoose.Schema.Types.ObjectId, ref: "Laundry", required: true },
    categories: [categorySchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔹 Utility method to recalc total price
cartSchema.methods.calculateTotal = function () {
  this.totalPrice = this.categories.reduce((total, category) => {
    return (
      total +
      category.products.reduce(
        (catTotal, product) => catTotal + product.price * product.quantity,
        0
      )
    );
  }, 0);
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

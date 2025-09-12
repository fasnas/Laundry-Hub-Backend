import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Men", "Women", "Kids", "Household"],
    required: true,
  }, 
  service: {
    type: String,
    enum: ["Wash + Fold", "Wash + Iron", "Steam Iron", "Dry Clean"],
    required: true,
  }, 
  imageUrl: { type: String, default: "" }, 
});

const ITEM = mongoose.model("Item", ItemSchema);

export default ITEM

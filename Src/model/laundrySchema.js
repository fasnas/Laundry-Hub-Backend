import mongoose from "mongoose";

const laundrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "laundry",
    },

    items: [
      {
        category: {
          type: String,
          enum: [
            "wash+fold",
            "wash+iron",
            "steamiron",
            "dryclean",
            "shoeclean",
          ],
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: {
      type: String,
      
    },
  },
  {
    timestamps: true,
  }
);

laundrySchema.index({ location: "2dsphere" });

const Laundry = mongoose.model("Laundry", laundrySchema);
export default Laundry;



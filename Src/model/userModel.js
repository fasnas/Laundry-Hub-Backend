import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    type: { type: String, enum: ["HOME", "WORK", "OTHER"], default: "HOME" },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requires: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
    },
    addresses: [addressSchema],
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    profileimage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      name: {
        type: String,
      },
    },

    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const USER = mongoose.model("USER", userSchema);
export default USER;

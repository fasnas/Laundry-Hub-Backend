import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        discountValue: {
            type: Number,
            required: true, // e.g. 20 means 20% if percentage, or ₹20 if flat
        },

        minOrderAmount: {
            type: Number,
            default: 0, // minimum order total for coupon to apply
        },

        // 🔑 Limited quantity support
        totalQuantity: {
            type: Number,
            required: true, // total times this coupon can be used
        },
        usedCount: {
            type: Number,
            default: 0, // increment after each successful redemption
        },

        perUserLimit: {
            type: Number,
            default: 1, // how many times a single user can use this coupon
        },

        startsAt: {
            type: Date,
            default: Date.now, // optional start date
        },
        expiresAt: {
            type: Date,
            required: true, // after this date coupon is invalid
        },

        isActive: {
            type: Boolean,
            default: true, // quick toggle without deleting
        },
        laundryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Laundry",
            required: true,
        },
    },
    { timestamps: true }
);

const Coupon=mongoose.model("Coupon", couponSchema);

export default Coupon;

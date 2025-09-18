import Laundry from "../model/laundrySchema.js";
import Coupon from "../model/couponSchema.js";

export const addCoupon = async (req, res) => {
    try {
        const laundryid = req.user.id;

        const laundry = await Laundry.findOne({ _id: laundryid });
        if (!laundry) {
            return res.status(404).json({ message: "Laundry not found" });
        }
        const coupon = await Coupon.create({
            ...req.body,
            laundryId: laundry._id,
        });

        res.status(201).json({ message: "Coupon created", coupon });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};


export const getCoupon = async (req, res) => {
    try {
        const laundryId = req.user.id;
        const couponList = await Coupon.find({ laundryId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "success",
            couponList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const deleteCoupon = async (req, res) => {
    try {
        const laundryId = req.user.id;
        const { couponId } = req.body
        console.log(couponId, "haha")
        await Coupon.findOneAndDelete({ _id: couponId });
        return res.status(200).json({
            message: "success",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const togglecoupon = async (req, res) => {
    try {
        const laundryid = req.user.id;
        const { couponId, isActive } = req.body;

        // find the laundry owned by this user
        const laundry = await Laundry.findOne({ _id: laundryid });
        if (!laundry) {
            return res.status(404).json({ message: "Laundry not found" });
        }

        // update the coupon’s active status
        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: couponId, laundryId: laundryid },    // ensure coupon belongs to this laundry
            { isActive },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found or not yours" });
        }

        return res.status(200).json({
            message: "Coupon status updated successfully",
            //   coupon: updatedCoupon,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

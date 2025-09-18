// import Cart from "../model/cartSchema.js";
// import Order from "../model/orderSchema.js";
// import USER from "../model/userModel.js";

// export const createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { addressId } = req.body;
//     // ✅ Remove laundryId from params since we'll get it from cart

//     const user = await USER.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // check address
//     const address = user.addresses.find((addr) => addr._id.toString() === addressId);
//     if (!address) {
//       return res.status(404).json({ success: false, message: "Address not found" });
//     }

//     // ✅ First, find any cart for this user (without specifying laundryId)
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart || cart.categories.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // ✅ Get laundryId from the cart data
//     const laundryId = cart.laundry;

//     // create new order
//     const newOrder = new Order({
//       user: userId,
//       laundry: laundryId, // ✅ use laundryId from cart
//       categories: cart.categories,
//       totalPrice: cart.totalPrice,
//       address: addressId,
//       status: "Ordered",
//     });

//     await newOrder.save();
//     await Cart.findByIdAndDelete(cart._id);
//     // clear cart after creating order
//     // cart.categories = [];
//     // cart.totalPrice = 0;
//     // await cart.save();

//     res.status(201).json({ success: true, order: newOrder });
//   } catch (err) {
//     console.error("Create order error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Get My Orders (User Side) ----------------
// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const orders = await Order.find({ user: userId })
//       .populate("laundry", "name location") // ✅ get laundry name and location
//       .populate("address") // ✅ get full address details
//       .sort({ createdAt: -1 });
//     console.log(orders)
//     res.json({ success: true, orders });
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ---------------- Get Laundry Orders (Laundry Side) ----------------
// export const getLaundryOrders = async (req, res) => {
//   try {
//     const laundryId = req.params.laundryId;

//     const orders = await Order.find({ laundry: laundryId })
//       .populate("user", "name email phone") // see which user placed order
//       .populate("address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.error("Laundry orders error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

//////////////above controller is using befor payment integraton/////////////

////////////not using right now,need later//////////

// ---------------- Update Order Status (Laundry Side) ----------------
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const validStatuses = ["Ordered", "In Progress", "Shipped", "Delivered", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     ).populate("laundry", "name location");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.json({ success: true, order });
//   } catch (err) {
//     console.error("Update order status error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// ---------------- Get Single Order Details ----------------
// export const getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.id;

//     const order = await Order.findById(orderId)
//       .populate("laundry", "name location mobile") // using mobile from your schema
//       .populate("user", "name email mobile addresses");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Check if user owns this order or if it's a laundry viewing their order
//     if (order.user._id.toString() !== userId) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     // ✅ Get the specific address details
//     const addressDetails = order.user.addresses.find(addr => 
//       addr._id.toString() === order.address.toString()
//     );

//     const orderWithAddress = {
//       ...order.toObject(),
//       addressDetails: addressDetails || null
//     };

//     res.json({ success: true, order: orderWithAddress });
//   } catch (err) {
//     console.error("Get order by ID error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

////////////////////////end --not using right now////////////////









/////////////payment integrated code ////////////////////////

import Cart from "../model/cartSchema.js";
import Order from "../model/orderSchema.js";
import USER from "../model/userModel.js";
import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";

// ---------------- Create Razorpay Order ----------------
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check address
    const address = user.addresses.find((addr) => addr._id.toString() === addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.categories.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const laundryId = cart.laundry;

    // 🔹 Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: cart.totalPrice * 100, // Amount in paise (multiply by 100)
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        laundryId: laundryId.toString(),
        addressId: addressId.toString()
      }
    });

    // 🔹 Create order in database with payment pending
    const newOrder = new Order({
      user: userId,
      laundry: laundryId,
      categories: cart.categories,
      totalPrice: cart.totalPrice,
      address: addressId,
      status: "Ordered",
      payment: {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "pending",
        amount: cart.totalPrice,
        currency: "INR"
      }
    });

    await newOrder.save();
    if (cart) {
        await Cart.findByIdAndDelete(cart._id);
      }

    res.status(201).json({
      success: true,
      order: newOrder,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });

    

  } catch (err) {
    console.error("Create Razorpay order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Verify Payment ----------------
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 🔹 Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 🔹 Find and update order
      const order = await Order.findOne({
        "payment.razorpayOrderId": razorpay_order_id
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // 🔹 Update payment details
      order.payment.razorpayPaymentId = razorpay_payment_id;
      order.payment.razorpaySignature = razorpay_signature;
      order.payment.paymentStatus = "completed";
      order.payment.paidAt = new Date();
      order.status = "Ordered"; // Change status to Ordered after successful payment

      await order.save();

      // // 🔹 Clear cart after successful payment
      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        await Cart.findByIdAndDelete(cart._id);
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        order: order
      });

    } else {
      // 🔹 Payment verification failed
      const order = await Order.findOne({
        "payment.razorpayOrderId": razorpay_order_id
      });

      if (order) {
        order.payment.paymentStatus = "failed";
        order.status = "Cancelled";
        await order.save();
      }

      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Handle Payment Failure ----------------
export const handlePaymentFailure = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const order = await Order.findOne({
      "payment.razorpayOrderId": razorpay_order_id
    });

    if (order) {
      order.payment.paymentStatus = "failed";
      order.status = "Cancelled";
      await order.save();
    }

    res.json({
      success: true,
      message: "Payment failure recorded"
    });

  } catch (err) {
    console.error("Payment failure error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ---------------- Get My Orders (User Side) ----------------
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("laundry", "name location")
      .sort({ createdAt: -1 });

    // 🔹 Format orders to include payment status
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      paymentStatus: order.payment.paymentStatus,
      paymentMethod: order.payment.paymentMethod,
      paidAt: order.payment.paidAt
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Get Laundry Orders (Laundry Side) ----------------
// export const getLaundryOrders = async (req, res) => {
//   try {
//     const laundryId = req.params.laundryId;
//     const orders = await Order.find({ laundry: laundryId })
//       .populate("user", "name email phone")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.error("Laundry orders error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ---------------- Update Order Status ----------------
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.json({ success: true, order });
//   } catch (err) {
//     console.error("Update order status error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
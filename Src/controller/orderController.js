// // controllers/orderController.js
// import Cart from "../model/cartSchema.js";
// import Order from "../model/orderSchema.js";
// import USER from "../model/userModel.js";

// export const createOrder = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { addressId } = req.body;

//         const user = await USER.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // check address
//         const address = user.addresses.find(addr => addr._id.toString() === addressId);
//         console.log(address)
//         if (!address) {
//             return res.status(404).json({ success: false, message: "Address not found" });
//         }

//         // fetch cart
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart || cart.categories.length === 0) {
//             return res.status(400).json({ success: false, message: "Cart is empty" });
//         }

//         // create new order
//         const newOrder = new Order({
//             user: userId,
//             categories: cart.categories, // copy everything
//             totalPrice: cart.totalPrice,
//             address: addressId,
//             status: "Ordered",
//         });

//         await newOrder.save();

//         // clear cart after order placed
//         cart.categories = [];
//         cart.totalPrice = 0;
//         await cart.save();

//         res.status(201).json({ success: true, order: newOrder });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };


// export const getMyOrders = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
//         console.log(orders)
//         console.log(userId)
//         res.json({ success: true, orders });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };




// import Cart from "../model/cartSchema.js";
// import Order from "../model/orderSchema.js";
// import USER from "../model/userModel.js";

// export const createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { addressId } = req.body;
//     const { laundryId } = req.params; // some mistake happened in this line take from cartmodel,,, 

//     const user = await USER.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // check address
//     const address = user.addresses.find((addr) => addr._id.toString() === addressId);
//     if (!address) {
//       return res.status(404).json({ success: false, message: "Address not found" });
//     }

//     // fetch cart for this user & laundry
//     const cart = await Cart.findOne({ user: userId, laundry: laundryId });
//     if (!cart || cart.categories.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // create new order
//     const newOrder = new Order({
//       user: userId,
//       laundry: laundryId, // ✅ link to laundry
//       categories: cart.categories,
//       totalPrice: cart.totalPrice,
//       address: addressId,
//       status: "Ordered",
//     });

//     await newOrder.save();

//     // clear cart for this laundry
//     cart.categories = [];
//     cart.totalPrice = 0;
//     await cart.save();

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
//       .populate("laundry", "name") // ✅ get laundry name
//       .populate("address") // ✅ get full address details
//       .sort({ createdAt: -1 });

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
//       .populate("user", "name email") // see which user placed order
//       .populate("address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.error("Laundry orders error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };




import Cart from "../model/cartSchema.js";
import Order from "../model/orderSchema.js";
import USER from "../model/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;
    // ✅ Remove laundryId from params since we'll get it from cart

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // check address
    const address = user.addresses.find((addr) => addr._id.toString() === addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // ✅ First, find any cart for this user (without specifying laundryId)
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.categories.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ✅ Get laundryId from the cart data
    const laundryId = cart.laundry;

    // create new order
    const newOrder = new Order({
      user: userId,
      laundry: laundryId, // ✅ use laundryId from cart
      categories: cart.categories,
      totalPrice: cart.totalPrice,
      address: addressId,
      status: "Ordered",
    });

    await newOrder.save();
    await Cart.findByIdAndDelete(cart._id);
    // clear cart after creating order
    // cart.categories = [];
    // cart.totalPrice = 0;
    // await cart.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Get My Orders (User Side) ----------------
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("laundry", "name location") // ✅ get laundry name and location
      .populate("address") // ✅ get full address details
      .sort({ createdAt: -1 });
    console.log(orders)
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Get Laundry Orders (Laundry Side) ----------------
export const getLaundryOrders = async (req, res) => {
  try {
    const laundryId = req.params.laundryId;

    const orders = await Order.find({ laundry: laundryId })
      .populate("user", "name email phone") // see which user placed order
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Laundry orders error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Update Order Status (Laundry Side) ----------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Ordered", "In Progress", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("laundry", "name location");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- Get Single Order Details ----------------
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate("laundry", "name location mobile") // using mobile from your schema
      .populate("user", "name email mobile addresses");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if user owns this order or if it's a laundry viewing their order
    if (order.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // ✅ Get the specific address details
    const addressDetails = order.user.addresses.find(addr => 
      addr._id.toString() === order.address.toString()
    );

    const orderWithAddress = {
      ...order.toObject(),
      addressDetails: addressDetails || null
    };

    res.json({ success: true, order: orderWithAddress });
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
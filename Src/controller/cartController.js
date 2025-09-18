import Cart from "../model/cartSchema.js";
import Order from "../model/orderSchema.js"
import Laundry from "../model/laundrySchema.js";


// 🔹 Helper: recalc total price
const recalcTotal = (cart) => {
  cart.totalPrice = cart.categories.reduce((total, category) => {
    return (
      total +
      category.products.reduce(
        (catTotal, product) => catTotal + product.price * product.quantity,
        0
      )
    );
  }, 0);
};

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { laundryId } = req.params;
    const { itemName, itemPrice, itemCategory, quantity = 1 } = req.body;

    if (!itemName || !itemPrice || !itemCategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ user: userId, laundry: laundryId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        laundry: laundryId,
        categories: [
          {
            categoryName: itemCategory,
            products: [{ name: itemName, price: itemPrice, quantity }],
          },
        ],
      });
    } else {
      let category = cart.categories.find(
        (c) => c.categoryName === itemCategory
      );

      if (!category) {
        cart.categories.push({
          categoryName: itemCategory,
          products: [{ name: itemName, price: itemPrice, quantity }],
        });
      } else {
        let product = category.products.find(
          (p) => p.name === itemName && p.price === itemPrice
        );
        if (product) {
          product.quantity += quantity;
        } else {
          category.products.push({ name: itemName, price: itemPrice, quantity });
        }
      }
    }

    recalcTotal(cart);
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
    console.log(cart)
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const { laundryId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id, laundry: laundryId })
      .populate("user", "name email")
      .populate("laundry", "name location");

    if (!cart) {
      return res.status(200).json({ cart: null, message: "Cart is empty" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ---------------- Remove Product ----------------
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log(productId, "pppppppppppppppppppppppppppppppp")
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let removed = false;

    cart.categories = cart.categories.filter((category) => {
      const beforeCount = category.products.length;
      category.products = category.products.filter(
        (p) => p._id.toString() !== productId
      );
      if (category.products.length < beforeCount) removed = true;
      return category.products.length > 0; // remove empty categories
    });

    if (!removed) return res.status(404).json({ message: "Product not found" });

    recalcTotal(cart);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Clear Cart
export const clearCart = async (req, res) => {
  try {
    const { laundryId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id, laundry: laundryId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // cart.categories = [];
    // cart.totalPrice = 0;

    await cart.save();
    await Cart.findByIdAndDelete(cart._id);

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Checkout (optional: create order)
export const checkout = async (req, res) => {
  try {
    const { laundryId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id, laundry: laundryId });
    if (!cart || cart.categories.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Example: create an order from cart
    const order = new Order({
      user: req.user.id,
      laundry: laundryId,
      items: cart.categories,
      totalPrice: cart.totalPrice,
      status: "Pending",
    });

    await order.save();

    // clear cart after checkout
    cart.categories = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




//for summary 

// controllers/cartController.js


export const getCartforsummary = async (req, res) => {
  try {
    // user id is set by verifyToken middleware
    const userId = req.user.id;

    // find the cart for this user
    const cart = await Cart.findOne({ user: userId })
      .populate("user", "name email")
      .populate("laundry", "name location");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: null,
        message: "Cart is empty",
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// ---------------- Update Quantity ----------------
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let productFound = false;

    for (let category of cart.categories) {
      let product = category.products.find(
        (p) => p._id.toString() === productId
      );
      if (product) {
        product.quantity = quantity;
        productFound = true;
        break;
      }
    }

    if (!productFound)
      return res.status(404).json({ message: "Product not found in cart" });

    recalcTotal(cart);
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
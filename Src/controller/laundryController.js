import Laundry from "../model/laundrySchema.js";
import Order from "../model/orderSchema.js";
import USER from "../model/userModel.js";
import { hashpassword } from "../utils/bcypt.js";
import mongoose from "mongoose";


export const registerLaundry = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Validation
    if (!name || !email || !password || !location?.coordinates) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing email
    const existingLaundry = await Laundry.findOne({ email });
    if (existingLaundry) {
      return res.status(409).json({ message: "Laundry with this email already exists." });
    }

    const existinguser = await USER.findOne({ email });
    if (existinguser) {
      return res.status(409).json({ message: " email already exists." });
    }

    const hashedpassword = await hashpassword(password)

    // Create laundry document
    const newLaundry = new Laundry({
      name,
      email,
      password: hashedpassword,
      location,
    });

    await newLaundry.save();

    return res.status(201).json({ message: "Laundry registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};



// controller/laundryController.js

export const getSingleLaundry = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    const laundry = await Laundry.findById(id);

    if (!laundry) {
      return res.status(404).json({ message: "Laundry not found" });
    }

    // If category filter is provided
    if (category) {
      const filteredItems = laundry.items.filter(
        (item) => item.category === category
      );
      return res.status(200).json({ items: filteredItems });
    }

    // Otherwise, return full laundry
    res.status(200).json({ laundry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





export const getLaundriesWithin50km = async (req, res) => {
  try {
    const { longitude, latitude, } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "longitude and latitude are required in request body",
      });
    }

    const laundries = await Laundry.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 50000, // 50 kilometers in meters
        },
      },
    });

    res.status(200).json({
      success: true,
      count: laundries.length,
      laundries,
    });
  } catch (error) {
    console.error("Error fetching nearby laundries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching nearby laundries",
    });
  }
};



//below controllers are for admin side operations

export const updateLaundryItems = async (req, res) => {
  const { items } = req.body;
  const id = req.user.id;

  try {
    const laundry = await Laundry.findById(id);
    if (!laundry) return res.status(404).json({ message: "Laundry not found" });

    // ✅ Check for duplicates
    const alreadyExists = items.some(newItem =>
      laundry.items.some(
        oldItem =>
          oldItem.category.toLocaleLowerCase() === newItem.category.toLocaleLowerCase() &&
          oldItem.name.toLocaleLowerCase() === newItem.name.toLocaleLowerCase()
      )
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "One or more items already exist with same category and name"
      });
    }

    // ✅ Add and save
    laundry.items.push(...items);
    await laundry.save();

    res.status(200).json({
      message: "Laundry items updated successfully",
      items: laundry.items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete laundry items

export const deleteitem = async (req, res) => {
  const { deleteid } = req.body;     // subdocument _id
  const userId = req.user.id;        // parent Laundry document id

  try {
    // remove the item whose _id matches deleteid from the items array
    const updatedLaundry = await Laundry.findByIdAndUpdate(
      userId,
      { $pull: { items: { _id: deleteid } } },
      { new: true }                  // return the updated document
    );

    if (!updatedLaundry) {
      return res.status(404).json({ message: "Laundry not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
      data: updatedLaundry.items,    // send back remaining items if you like
    });
  } catch (error) {
    // console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error while deleting product" });
  }
};


//for getting laundry items

export const getLaundryItems = async (req, res) => {
  const id = req.user.id;
  // console.log(id)
  try {
    const laundry = await Laundry.findById(id);
    if (!laundry) {
      return res.status(404).json({ message: "Laundry not found" });
    }

    res.status(200).json({
      message: "Laundry items fetched successfully",
      items: laundry.items,
    });
  } catch (err) {
    // console.error("Error fetching laundry items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


//for getting laundrywise orders

export const getLaundryOrders = async (req, res) => {
  const id = req.user.id
  // console.log(id)
  try {
    const orders = await Order.find({ laundry: id })
    if (!orders) {
      return res.status(404).json({ message: "There's no orders" });
    }

    res.status(200).json({
      message: "orders fetched succussfully",
      items: orders
    });


  } catch (error) {
    res.status(400).json({
      message: "error hapene"
    });
  }
}



// 


export const statusupdate = async (req, res) => {
  const { orderid, status } = req.body;
  console.log(typeof(orderid),typeof(status))

  try {
    if (!mongoose.Types.ObjectId.isValid(orderid)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(orderid);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({
      message: "Error happened while status updation",
      error: error.message,
    });
  }
};

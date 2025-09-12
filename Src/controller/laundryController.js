import Laundry from "../model/laundrySchema.js";
import USER from "../model/userModel.js";
import { hashpassword } from "../utils/bcypt.js";


export const registerLaundry = async (req, res) => {
  try {
    const { name, email, password,  location } = req.body;

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
    
    const hashedpassword= await hashpassword(password)

    // Create laundry document
    const newLaundry = new Laundry({
      name,
      email,
      password:hashedpassword,
      location,
    });

    await newLaundry.save();

    return res.status(201).json({ message: "Laundry registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};



export const GetAllLaundry = async (req, res) => {
  try {
    const laundries = await Laundry.find();

    res.status(200).json({
      success: true,
      count: laundries.length,
      laundries,
    });
  } catch (error) {
    console.error("Error fetching laundries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch laundries",
    });
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


export const updateLaundryItems = async (req, res) => {
  const { items } = req.body;
  const id = req.user.id;
  console.log(req.user)

  try {
    const laundry = await Laundry.findById(id);
    if (!laundry) {
      return res.status(404).json({ message: "Laundry not found" });
    }

    laundry.items = laundry.items.concat(items); 
    await laundry.save();

    res.status(200).json({
      message: "Laundry items updated successfully",
      items: laundry.items,
    });
  } catch (err) {
    console.error("Error updating laundry items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getLaundryItems = async (req, res) => {
  const id = req.user.id; 
  console.log(id)
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
    console.error("Error fetching laundry items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

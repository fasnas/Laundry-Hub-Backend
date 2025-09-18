import USER from "../model/userModel.js";

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, line1, line2, city, state, zip, type } = req.body;

    if (!name || !phone || !line1 || !city || !state || !zip) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const user = await USER.findById(userId);
    user.addresses.push({ name, phone, line1, line2, city, state, zip, type });
    await user.save();

    res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await USER.findById(req.user.id);
    res.status(200).json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Select address for payment
export const selectAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;
    console.log(addressId)

    const user = await USER.findById(userId);
    const selectedAddress = user.addresses.id(addressId);
    if (!selectedAddress) return res.status(404).json({ message: "Address not found" });

    // You can store selected address temporarily in session/cart or return it to frontend for payment
    res.status(200).json({ message: "Address selected", selectedAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteAddress = async (req, res) => {
  const { addressId } = req.body;
  const userId = req.user.id;

  try {
    // remove the matching subdocument from the array
    await USER.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    res.status(200).json({ message: "Address deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while deleting address", error: err.message });
  }
};

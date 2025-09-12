import ITEM from "../model/serviceSchema.js";

export const createItem = async (req, res) => {
  try {
    const { name, price, category, service, imageUrl } = req.body;

    if (!name || !price || !category || !service) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newItem = new ITEM({ name, price, category, service, imageUrl });
    await newItem.save();

    res.status(201).json({ message: 'Item created successfully', data: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await ITEM.find();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFilteredItems = async (req, res) => {
  try {
    const { category, service } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (service) filter.service = service;

    const items = await ITEM.find(filter);

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// // Get item by ID
// exports.getItemById = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);
//     if (!item) return res.status(404).json({ message: 'Item not found' });

//     res.status(200).json({ success: true, data: item });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update item
// exports.updateItem = async (req, res) => {
//   try {
//     const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedItem) return res.status(404).json({ message: 'Item not found' });

//     res.status(200).json({ message: 'Item updated', data: updatedItem });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete item
// exports.deleteItem = async (req, res) => {
//   try {
//     const deletedItem = await Item.findByIdAndDelete(req.params.id);
//     if (!deletedItem) return res.status(404).json({ message: 'Item not found' });

//     res.status(200).json({ message: 'Item deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

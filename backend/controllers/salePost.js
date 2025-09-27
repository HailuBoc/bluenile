import Sale from "../models/sale.js";

// ✅ Create Sale
export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res
      .status(400)
      .json({ message: "❌ Error creating sale", error: err.message });
  }
};

// ✅ Get All Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error fetching sales", error: err.message });
  }
};

// ✅ Update Sale
export const updateSale = async (req, res) => {
  try {
    const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Sale not found" });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error updating sale", error: err.message });
  }
};

// ✅ Delete Sale
export const deleteSale = async (req, res) => {
  try {
    const deleted = await Sale.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Sale not found" });
    res.json({ message: "✅ Sale deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error deleting sale", error: err.message });
  }
};

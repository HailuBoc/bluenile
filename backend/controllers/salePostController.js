import SalePost from "../models/SalePost.js";

// CREATE
export const createSale = async (req, res) => {
  try {
    const { title, category, price, location, description } = req.body;
    const img = req.file ? req.file.path : null;

    const sale = new SalePost({
      title,
      category,
      price,
      location,
      description,
      img,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    console.error("❌ Error creating sale:", err);
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getSales = async (req, res) => {
  try {
    const sales = await SalePost.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getSaleById = async (req, res) => {
  try {
    const sale = await SalePost.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateSale = async (req, res) => {
  try {
    const { title, category, price, location, description } = req.body;
    const img = req.file ? req.file.path : undefined;

    const updatedSale = await SalePost.findByIdAndUpdate(
      req.params.id,
      { title, category, price, location, description, ...(img && { img }) },
      { new: true }
    );

    if (!updatedSale) return res.status(404).json({ error: "Sale not found" });

    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteSale = async (req, res) => {
  try {
    const deletedSale = await SalePost.findByIdAndDelete(req.params.id);
    if (!deletedSale) return res.status(404).json({ error: "Sale not found" });

    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// APPROVE
export const approveSale = async (req, res) => {
  try {
    const sale = await SalePost.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REJECT
export const rejectSale = async (req, res) => {
  try {
    const sale = await SalePost.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

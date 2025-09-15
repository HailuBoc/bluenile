// import express from "express";
// import mongoose from "mongoose";
// import Car from "../models/carModel.js";
// import House from "../models/House.js";
// import Product from "../models/Product.js";
// import Tourism from "../models/Tourism.js";

// const router = express.Router();

// // POST /api/likes/:type/:id
// router.post("/:type/:id", async (req, res) => {
//   const { type, id } = req.params;
//   let Model;

//   switch (type) {
//     case "car":
//       Model = Car;
//       break;
//     case "house":
//       Model = House;
//       break;
//     case "product":
//       Model = Product;
//       break;
//     case "tourism":
//       Model = Tourism;
//       break;
//     default:
//       return res.status(400).json({ message: "Invalid type" });
//   }

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(400).json({ message: "Invalid ID" });

//   try {
//     const item = await Model.findById(id);
//     if (!item) return res.status(404).json({ message: `${type} not found` });

//     item.likes = (item.likes || 0) + 1;
//     await item.save();

//     res.json({ likes: item.likes });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;

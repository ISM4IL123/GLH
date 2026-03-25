import express from "express";
import { Product } from "../db.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// POST new product
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const newProduct = await Product.save({ name, price, stock });
  res.status(201).json({ success: true, product: newProduct });
});

export default router;
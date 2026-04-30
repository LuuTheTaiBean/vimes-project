import express from "express";
import {pool} from "../config/db";

const router = express.Router();

// lấy kho
router.get("/warehouses", async (req, res) => {
  const result = await pool.query("SELECT * FROM warehouses");
  res.json(result.rows);
});

// lấy nhà cung cấp
router.get("/suppliers", async (req, res) => {
  const result = await pool.query("SELECT * FROM suppliers");
  res.json(result.rows);
});

// lấy sản phẩm
router.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

export default router;

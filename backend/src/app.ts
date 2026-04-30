import express from "express";
import cors from "cors";
import receiptRoutes from "./routes/receipt.routes";
import commonRoutes from "./routes/common.routes";

const app = express();

// ✅ middleware trước
app.use(cors());
app.use(express.json());

// ✅ routes
app.use("/api", commonRoutes);
app.use("/api/receipts", receiptRoutes);

// test server
app.get("/", (req, res) => {
  res.send("API VIMES đang chạy 🚀");
});

export default app;
// D:\vimes-project\backend\src\app.ts

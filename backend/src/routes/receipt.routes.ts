// File này giống như bảng chỉ đường. Khi frontend gọi API tạo phiếu nhập, file route
// này quyết định request đó sẽ được chuyển tới hàm xử lý nào.
// khai báo API
// nhận biết method POST
// nối API với controller tương ứng

import {Router} from "express";
// Import Router từ Express để tạo các route (API)

import {createReceipt} from "../controllers/receipt.controller";
// Import hàm xử lý logic tạo phiếu nhập từ controller

// Tạo một router riêng cho module phiếu nhập.
const router = Router();

// =======================
// Định nghĩa API
// =======================

// Khi client gửi request:
// POST /receipt
// → sẽ gọi hàm createReceipt để xử lý
router.post("/", createReceipt);

// =======================
// Export router
// =======================

// Xuất router để file chính (app.ts / server.ts) sử dụng
export default router;

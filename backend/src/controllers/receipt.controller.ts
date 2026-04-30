import {Request, Response} from "express";
import {pool} from "../config/db";

// Hàm tạo phiếu nhập
export const createReceipt = async (req: Request, res: Response) => {
  // Lấy 1 connection từ pool (PostgreSQL)
  const client = await pool.connect();

  try {
    // Lấy dữ liệu từ request body (frontend gửi lên)
    const {code, warehouse_id, supplier_id, import_date, note, details} =
      req.body;

    // Bắt đầu transaction (đảm bảo dữ liệu không bị lỗi nửa chừng)
    await client.query("BEGIN");

    // =======================
    // 1. Thêm phiếu nhập (bảng chính)
    // =======================
    const receiptResult = await client.query(
      `INSERT INTO import_receipts 
      (code, warehouse_id, supplier_id, import_date, note, total_amount, status, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
      RETURNING id`, // trả về id vừa insert
      [code, warehouse_id, supplier_id, import_date, note, 0, "draft"], // total = 0 ban đầu
    );

    // Lấy id của phiếu nhập vừa tạo
    const receiptId = receiptResult.rows[0].id;

    // Biến lưu tổng tiền của toàn bộ phiếu nhập
    let totalAmount = 0;

    // =======================
    // 2. Thêm chi tiết phiếu nhập (bảng con)
    // =======================
    for (const item of details) {
      // Tính tổng tiền cho từng sản phẩm
      const total = item.quantity * item.price;

      // Cộng dồn vào tổng tiền
      totalAmount += total;

      // Insert từng dòng chi tiết
      await client.query(
        `INSERT INTO import_receipt_details 
        (receipt_id, product_id, quantity, price, total)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          receiptId, // id phiếu nhập
          item.product_id, // id sản phẩm
          item.quantity, // số lượng
          item.price, // giá
          total, // tổng tiền dòng đó
        ],
      );
    }

    // =======================
    // 3. Cập nhật tổng tiền cho phiếu nhập
    // =======================
    await client.query(
      `UPDATE import_receipts SET total_amount = $1 WHERE id = $2`,
      [totalAmount, receiptId],
    );

    // =======================
    // 4. Lưu tất cả thay đổi (commit)
    // =======================
    await client.query("COMMIT");

    // Trả kết quả thành công về frontend
    res.status(201).json({
      message: "Tạo phiếu nhập thành công",
      receiptId,
    });
  } catch (error) {
    // Nếu có lỗi → quay lại trạng thái ban đầu (không lưu gì)
    await client.query("ROLLBACK");

    console.error(error);

    // Trả lỗi về client
    res.status(500).json({error: "Lỗi server"});
  } finally {
    // Luôn giải phóng connection (tránh bị đầy pool)
    client.release();
  }
};

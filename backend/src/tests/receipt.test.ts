import request from "supertest";
import app from "../app";
import {pool} from "../config/db";

const code = "TEST_" + Date.now();
describe("POST /api/receipts", () => {
  it("Tạo phiếu nhập thành công", async () => {
    const res = await request(app)
      .post("/api/receipts")
      .send({
        code: code,
        warehouse_id: 1,
        supplier_id: 1,
        import_date: "2026-04-24",
        note: "Test",
        details: [
          {
            product_id: 1,
            quantity: 5,
            price: 1000,
          },
        ],
      });

    console.log(res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("receiptId");
  });
});
afterAll(async () => {
  await pool.end();
});

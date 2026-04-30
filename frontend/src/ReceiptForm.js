import React, {useState, useEffect} from "react";
import "./ReceiptForm.css";

function ReceiptForm() {
  const [form, setForm] = useState({
    code: "TEST_" + Date.now(),
    warehouse_id: "",
    supplier_id: "",
    product_id: "",
    quantity: 1,
    price: 1000,
  });

  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [message, setMessage] = useState("");

  // 🚀 Load dữ liệu từ backend
  useEffect(() => {
    fetch("http://localhost:3000/api/warehouses")
      .then((res) => res.json())
      .then((data) => setWarehouses(data));

    fetch("http://localhost:3000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data));

    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.warehouse_id || !form.supplier_id || !form.product_id) {
      setMessage("❌ Vui lòng chọn đầy đủ thông tin");
      return;
    }

    const payload = {
      code: form.code,
      warehouse_id: Number(form.warehouse_id),
      supplier_id: Number(form.supplier_id),
      import_date: new Date().toISOString(),
      note: "Nhập từ UI",
      details: [
        {
          product_id: Number(form.product_id),
          quantity: Number(form.quantity),
          price: Number(form.price),
        },
      ],
    };

    try {
      const res = await fetch("http://localhost:3000/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Thành công! ID: " + data.receiptId);

      // reset form
      setForm({
        code: "TEST_" + Date.now(),
        warehouse_id: "",
        supplier_id: "",
        product_id: "",
        quantity: 1,
        price: 1000,
      });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">📦 Nhập phiếu nhập</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit} className="form">
          {/* Mã phiếu */}
          <div className="group">
            <label>Mã phiếu</label>
            <input value={form.code} readOnly className="input" />
          </div>

          {/* Kho */}
          <div className="group">
            <label>Kho</label>
            <select
              name="warehouse_id"
              value={form.warehouse_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nhà cung cấp */}
          <div className="group">
            <label>Nhà cung cấp</label>
            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">-- Chọn NCC --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sản phẩm */}
          <div className="group">
            <label>Sản phẩm</label>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Số lượng + giá */}
          <div className="row">
            <div className="group">
              <label>Số lượng</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="group">
              <label>Giá</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <button type="submit" className="button">
            🚀 Gửi phiếu
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReceiptForm;

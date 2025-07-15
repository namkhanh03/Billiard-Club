// DrinkListModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Spinner, Form } from "react-bootstrap";
import { getAllDrinkFoods } from "../../../services/drinkFoodService";
import { getAllCategories } from "../../../services/categoryService";
import { formatCurrency } from "../../../utils/formatCurrency";

const DrinkListModal = ({ open, onClose, facilityId }) => {
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDrinks = async () => {
    if (!open) return;
    setLoading(true);
    try {
      const data = await getAllDrinkFoods(1, 100, search, selectedCategory, facilityId);
      setDrinks(data.content || []);
    } catch (err) {
      console.error("Lỗi khi tải đồ uống", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.content || []);
    } catch (err) {
      console.error("Lỗi khi tải danh mục", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDrinks();
      fetchCategories();
    }
  }, [open, search, selectedCategory]);

  return (
    <Modal
      show={open}
      onHide={onClose}
      centered
      dialogClassName="modal-xl"
      style={{ color: "#fff" }}
    >
      <Modal.Header closeButton style={{ backgroundColor: "#1e1e1e", borderBottom: "1px solid #444" }}>
        <Modal.Title style={{ color: "#ff7b1d" }}>Danh sách đồ uống / món ăn</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#1e1e1e", maxHeight: "70vh", overflowY: "auto" }}>
        <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: 300, borderRadius: 8 }}
          />

          <Form.Select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            style={{ flex: 1, maxWidth: 300, borderRadius: 8 }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="light" />
          </div>
        ) : drinks.length === 0 ? (
          <div style={{ color: "#ccc" }}>Chưa cập nhật menu.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {drinks.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#2c2c2c",
                  border: "1px solid #444",
                  borderRadius: 10,
                  padding: 12,
                  width: "calc(25% - 12px)",
                  minWidth: 200,
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={item.image || "/drink-default.png"}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #555",
                    marginBottom: 8,
                  }}
                />
                <div style={{ color: "#ff7b1d", fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: "#ddd" }}>{formatCurrency(item.price)}</div>
                {item.category?.name && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      padding: "4px 10px",
                      backgroundColor: "#ff7b1d",
                      color: "#000",
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      marginTop: 6,
                      fontWeight: 500,
                      width: "fit-content",
                    }}
                  >
                    <img
                      src={item.category.image || "https://via.placeholder.com/30"}
                      alt="category"
                      style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 8 }}
                    />
                    {item.category.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DrinkListModal;

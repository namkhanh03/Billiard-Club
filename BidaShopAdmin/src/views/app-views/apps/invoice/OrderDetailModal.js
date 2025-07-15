import React, { useState, useEffect } from "react";
import { Modal, message } from "antd"; // Importing Modal component
import { formatCurrency } from "utils/formatCurrency"; // Import utility to format currency

const OrderDetailModal = ({
  visible,
  onClose,
  selectedOrder,
  fetchOrdersData,
}) => {
  const [totalDrinkCost, setTotalDrinkCost] = useState(0);

  // Calculate the total drink cost from orderDetails
  useEffect(() => {
    if (selectedOrder?.orderDetails) {
      const drinkCost = selectedOrder.orderDetails.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );
      setTotalDrinkCost(drinkCost);
    }
  }, [selectedOrder]);

  return (
    <Modal
      title={`Chi tiết hóa đơn chơi bida: ${selectedOrder?.id}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div>
        {/* General Order Information */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            Mã hóa đơn: {selectedOrder.id}
          </h2>
        </div>
        <p style={{ color: "#6B7280" }}>
          {new Date(selectedOrder.startTime).toLocaleString("vi-VN")}
        </p>

        {/* Customer Information */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {/* Cột khách hàng */}
          <div
            style={{
              flex: 1,
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Thông tin khách hàng
            </h3>
            <div>
              <p style={{ color: "#1a3353" }}>
                <strong>Mã Khách:</strong> {selectedOrder?.customer?.userId || "Khách lẻ"}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Họ tên:</strong> {selectedOrder?.customer?.fullName || "Khách lẻ"}
              </p>

              <p style={{ color: "#1a3353" }}>
                <strong>Email:</strong> {selectedOrder?.customer?.email || "Không cung cấp"}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder?.customer?.phoneNumber || selectedOrder?.customerPhone || "Không cung cấp"}
              </p>
            </div>
          </div>

          {/* Cột nhân viên thanh toán */}
          <div
            style={{
              flex: 1,
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Nhân viên thanh toán
            </h3>
            <div>
              <p style={{ color: "#1a3353" }}>
                <strong>Mã NV:</strong> {selectedOrder.staff?.userId || "Không có"}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Họ tên:</strong> {selectedOrder.staff?.fullName || "Không có"}
              </p>

              <p style={{ color: "#1a3353" }}>
                <strong>Email:</strong> {selectedOrder.staff?.email || "Không có"}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.staff?.phoneNumber || "Không có số điện thoại"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Chi tiết đơn hàng
          </h3>
          {selectedOrder.orderDetails.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={item.drink.image}
                  alt={item.drink.name}
                  style={{
                    width: "5rem",
                    height: "5rem",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                  }}
                />
                <div>
                  <p style={{ fontWeight: "600", color: "#1a3353" }}>
                    {item.drink.name}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: "600", color: "#1a3353" }}>
                  {formatCurrency(item.unitPrice)} x {item.quantity} ={" "}
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Tóm tắt hóa đơn
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Tiền chơi</p>
            <p style={{ color: "#1a3353" }}>
              {formatCurrency(selectedOrder.totalAmount - totalDrinkCost)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Tiền sử dụng đồ uống</p>
            <p style={{ color: "#1a3353" }}>{formatCurrency(totalDrinkCost)}</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Tổng tiền</p>
            <p style={{ color: "#1a3353" }}>{formatCurrency(selectedOrder.totalAmount)}</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Thời gian chơi</p>
            <p style={{ color: "#1a3353" }}>
              {(() => {
                const totalMinutes = selectedOrder.playDuration || 0;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return `${hours > 0 ? `${hours} giờ ` : ""}${minutes} phút`;
              })()}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Phương thức thanh toán</p>
            <p style={{ color: "#1a3353" }}>
              {selectedOrder.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;

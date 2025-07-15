import React, { useState } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

const PricingDetailForm = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onAdd(values); // Gọi hàm onAdd từ modal cha để thêm chi tiết
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Chi Tiết Bảng Giá"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Thời gian khung giờ */}
        <Form.Item
          name="timeSlot"
          label="Khung Giờ"
          rules={[{ required: true, message: "Vui lòng nhập khung giờ!" }]}
        >
          <Input placeholder="Ví dụ: 00:00 - 12:00" />
        </Form.Item>

        {/* Giá tiền */}
        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá tiền"
            formatter={(value) => `${value}`}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PricingDetailForm;

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Spin, message } from "antd";
import { updateBilliardTable } from "services/billiardTableService";
import { getFacilityByUser } from "services/facilityUserService";
import { getAllPricings } from "services/pricingService"; // API lấy bảng giá

const { Option } = Select;

const EditBilliardTableModal = ({ visible, tableData, onCancel, refreshTables }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [pricings, setPricings] = useState([]); // Danh sách bảng giá
  const userData = JSON.parse(localStorage.getItem("user"));

  // Lấy danh sách cơ sở khi mở modal
  useEffect(() => {
    async function fetchFacilities() {
      try {
        const data = await getFacilityByUser(userData.userId); // Lấy cơ sở của người dùng
        setFacilities(data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách cơ sở.");
      }
    }

    async function fetchPricings() {
      try {
        const data = await getAllPricings(1, 100); // Lấy tất cả các bảng giá
        setPricings(data.content); // Dữ liệu bảng giá có thể cần phải được truyền vào "content"
      } catch (error) {
        message.error("Lỗi khi tải danh sách bảng giá.");
      }
    }

    fetchFacilities();
    fetchPricings();
  }, []);

  // Đặt dữ liệu bàn bi-a vào form khi có dữ liệu
  useEffect(() => {
    if (tableData) {
      form.setFieldsValue({
        name: tableData.name,
        status: tableData.status,
        facilityId: tableData.facility?.id || null,
        pricingId: tableData.pricing?.id || null, // Lấy pricingId từ bàn bi-a
      });
    }
  }, [tableData, form]);

  // Xử lý khi người dùng submit form
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateBilliardTable(tableData.id, values); // Gửi dữ liệu cập nhật bàn bi-a
      refreshTables();
      message.success("Cập nhật bàn bi-a thành công");
      onCancel();
    } catch (error) {
      message.error("Cập nhật bàn bi-a thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Bàn Bi-A"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Tên bàn bi-a */}
        <Form.Item
          name="name"
          label="Tên Bàn Bi-A"
          rules={[{ required: true, message: "Vui lòng nhập tên bàn!" }]}
        >
          <Input />
        </Form.Item>

        {/* Chọn trạng thái */}
        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Available">Có sẵn</Option>
            <Option value="In Use">Đang sử dụng</Option>
          </Select>
        </Form.Item>

        {/* Chọn cơ sở */}
        <Form.Item
          name="facilityId"
          label="Cơ Sở"
          rules={[{ required: true, message: "Vui lòng chọn cơ sở!" }]}
        >
          <Select placeholder="Chọn cơ sở">
            {facilities.map((facility) => (
              <Option key={facility.id} value={facility.id}>
                <img
                  src={facility?.images[0].imageUrl || "https://via.placeholder.com/30"}
                  alt="Facility"
                  width={30}
                  height={30}
                  style={{ marginRight: 10, borderRadius: "50%" }}
                />
                {facility.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn bảng giá */}
        <Form.Item
          name="pricingId"
          label="Bảng Giá"
          rules={[{ required: true, message: "Vui lòng chọn bảng giá!" }]}
        >
          <Select placeholder="Chọn bảng giá">
            {pricings.map((pricing) => (
              <Option key={pricing.id} value={pricing.id}>
                {pricing.description}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
    </Modal>
  );
};

export default EditBilliardTableModal;

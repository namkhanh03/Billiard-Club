import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber, message, Tag, Upload } from "antd";
import { createIncomeExpense } from "services/incomeExpenseService"; // Call the service for creating IncomeExpense
import { getFacilityByUser } from "services/facilityUserService"; // Get facilities the user manages
import moment from "moment"; // For handling date format
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateIncomeExpenseModal = ({ visible, onCancel, refreshIncomeExpenses }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]); // List of facilities
  const [fileList, setFileList] = useState([]); // List to store the selected files

  const userData = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

  // Fetch facilities that the user manages (MANAGER role)
  const fetchFacilities = useCallback(async () => {
    try {
      const data = await getFacilityByUser(userData.userId); // Fetch facilities the user manages
      setFacilities(data); // Set facilities list
    } catch (error) {
      message.error("Lỗi khi lấy danh sách cơ sở.");
    }
  }, [userData.userId]);

  useEffect(() => {
    if (visible) {
      fetchFacilities(); // Fetch facilities when modal is visible
    }
  }, [visible, fetchFacilities]);

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      // Destructure the values from the form
      const { type, amount, date, description, facilityId } = values;
      const userId = userData.userId; // Get userId from localStorage

      // Prepare the data to be sent to the backend (without manually appending files here)
      const incomeExpenseData = {
        type,
        amount,
        date: moment(date).toISOString(), // Convert date to ISO string for consistency
        description,
        facilityId,
        userId, // Send the userId directly
        files: fileList, // Include the files in the data to be sent to the service
      };

      // Call the API to create a new income/expense with files included
      await createIncomeExpense(incomeExpenseData);

      message.success("Tạo mới thu chi thành công!");
      refreshIncomeExpenses(); // Refresh the list of income/expenses
      onCancel(); // Close the modal
    } catch (error) {
      message.error("Lỗi khi tạo thu chi.");
    } finally {
      setLoading(false);
    }
  };


  // Example of file input handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileList(file); // store fileList as FileList object (not as an array)
  };


  return (
    <Modal
      title="Thêm Mới Thu Chi"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreate}
        initialValues={{
          type: "Income",
          amount: 0,
          date: moment(),
        }}
      >
        <Form.Item
          label="Loại thu chi"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại thu chi!" }]}
        >
          <Select>
            <Option value="Income"><Tag color="green">Hóa đơn thu</Tag></Option>
            <Option value="Expense"><Tag color="red">Hóa đơn chi</Tag></Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Số tiền"
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập số tiền"
          />
        </Form.Item>

        <Form.Item
          label="Ngày"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <Input.TextArea placeholder="Mô tả" rows={4} />
        </Form.Item>

        <Form.Item
          label="Cơ sở"
          name="facilityId"
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

        <Form.Item label="Tải lên file" name="file">
          <Input
            type="file"
            onChange={handleFileChange}
            style={{ display: "block" }} // Hiển thị như block để dễ dàng quản lý
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIncomeExpenseModal;

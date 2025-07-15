import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Spin, message, Upload } from "antd";
import { createFacility } from "services/facilityService";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CreateFacilityModal = ({ visible, onCancel, refreshFacilities }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Tách riêng code và name cho từng cấp hành chính
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [selectedWardCode, setSelectedWardCode] = useState(null);

  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  const [imagePreviewUrl, setImagePreviewUrl] = useState("https://i.pinimg.com/736x/13/aa/4e/13aa4e54ad0ad1b177591d427992cddb.jpg");

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(response.data);
      } catch (error) {
        message.error("Lỗi khi tải tỉnh thành.");
      }
    }
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceCode, option) => {
    setSelectedProvinceCode(provinceCode);
    setSelectedProvinceName(option.children);
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts);
      setWards([]);
      setSelectedDistrictCode(null);
      setSelectedWardCode(null);
      setSelectedDistrictName("");
      setSelectedWardName("");
    } catch (error) {
      message.error("Lỗi khi tải quận huyện.");
    }
  };

  const handleDistrictChange = async (districtCode, option) => {
    setSelectedDistrictCode(districtCode);
    setSelectedDistrictName(option.children);
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
      setSelectedWardCode(null);
      setSelectedWardName("");
    } catch (error) {
      message.error("Lỗi khi tải xã/phường.");
    }
  };

  const handleWardChange = (wardCode, option) => {
    setSelectedWardCode(wardCode);
    setSelectedWardName(option.children);
  };

  const handleFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh.");
      return;
    }
    const imageFiles = fileList.map((file) => file.originFileObj);

    const address = `${values.address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
    values.address = address;

    setLoading(true);
    try {
      await createFacility(values, imageFiles);
      refreshFacilities();
      form.resetFields();
      setImageFile(null);
      setImagePreviewUrl("https://via.placeholder.com/150");
      onCancel();
      message.success("Thêm chi nhánh thành công");
    } catch (error) {
      message.error("Thêm chi nhánh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    const filteredFiles = fileList.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
    );

    if (filteredFiles.length !== fileList.length) {
      message.error("Chỉ chấp nhận file ảnh có định dạng .jpg, .png hoặc .webp.");
    }

    setFileList(filteredFiles);
  };



  return (
    <Modal
      visible={visible}
      title="Thêm Mới Chi Nhánh"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên chi nhánh"
          rules={[{ required: true, message: "Vui lòng nhập tên chi nhánh!" }]}
        >
          <Input placeholder="Tên chi nhánh" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại chi nhánh"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại chi nhánh!" }]}
        >
          <Input placeholder="Số điện thoại chi nhánh" />
        </Form.Item>

        <Form.Item
          name="province"
          label="Tỉnh/Thành"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh thành!" }]}
        >
          <Select onChange={handleProvinceChange} placeholder="Chọn tỉnh thành">
            {provinces.map((province) => (
              <Option key={province.code} value={province.code}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng chọn quận huyện!" }]}
        >
          <Select onChange={handleDistrictChange} placeholder="Chọn quận huyện">
            {districts.map((district) => (
              <Option key={district.code} value={district.code}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ward"
          label="Xã/Phường"
          rules={[{ required: true, message: "Vui lòng chọn xã phường!" }]}
        >
          <Select onChange={handleWardChange} placeholder="Chọn xã phường">
            {wards.map((ward) => (
              <Option key={ward.code} value={ward.code}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ (Số nhà, tên đường)!" }]}
        >
          <Input placeholder="VD: 70 Đường Nguyễn Chí Thanh" />
        </Form.Item>
        <Form.Item
          name="images"
          label="Hình Ảnh"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất một hình ảnh!" }]}
        >
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Chặn tự động tải lên
            accept=".jpg,.jpeg,.png,.webp"
          >
            {fileList.length < 5 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
    </Modal>
  );
};

export default CreateFacilityModal;

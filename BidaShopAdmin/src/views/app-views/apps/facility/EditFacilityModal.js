import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Spin, Upload, Select } from "antd";
import { updateFacility } from "services/facilityService";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const EditFacilityModal = ({ visible, facilityData, onCancel, refreshFacilities }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("https://i.pinimg.com/736x/13/aa/4e/13aa4e54ad0ad1b177591d427992cddb.jpg");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [selectedWardCode, setSelectedWardCode] = useState(null);

  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

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

  useEffect(() => {
    async function initAddress() {
      if (!facilityData) return;

      const fullAddress = facilityData.address || "";
      const [street = "", wardText = "", districtText = "", provinceText = ""] = fullAddress.split(",").map(s => s.trim());

      form.setFieldsValue({
        name: facilityData.name,
        phoneNumber: facilityData.phoneNumber,
        address: street,
      });

      setFileList(
        facilityData.images?.map((image, index) => ({
          uid: index,
          name: `image-${index}.jpg`,
          status: "done",
          url: image.imageUrl,
        })) || []
      );

      try {
        const provincesRes = await axios.get("https://provinces.open-api.vn/api/p/");
        const allProvinces = provincesRes.data;
        setProvinces(allProvinces);

        const matchedProvince = allProvinces.find(p => provinceText.includes(p.name));
        if (!matchedProvince) return;

        setSelectedProvinceCode(matchedProvince.code);
        setSelectedProvinceName(matchedProvince.name);
        form.setFieldsValue({ province: matchedProvince.code });

        const districtsRes = await axios.get(`https://provinces.open-api.vn/api/p/${matchedProvince.code}?depth=2`);
        const allDistricts = districtsRes.data.districts;
        setDistricts(allDistricts);

        const matchedDistrict = allDistricts.find(d => districtText.includes(d.name));
        if (!matchedDistrict) return;

        setSelectedDistrictCode(matchedDistrict.code);
        setSelectedDistrictName(matchedDistrict.name);
        form.setFieldsValue({ district: matchedDistrict.code });

        const wardsRes = await axios.get(`https://provinces.open-api.vn/api/d/${matchedDistrict.code}?depth=2`);
        const allWards = wardsRes.data.wards;
        setWards(allWards);

        const matchedWard = allWards.find(w => wardText.includes(w.name));
        if (!matchedWard) return;

        setSelectedWardCode(matchedWard.code);
        setSelectedWardName(matchedWard.name);
        form.setFieldsValue({ ward: matchedWard.code });
      } catch (err) {
        console.error("Error parsing address", err);
      }
    }

    initAddress();
  }, [facilityData, form]);

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
      form.setFieldsValue({ district: undefined, ward: undefined });
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
      form.setFieldsValue({ ward: undefined });
    } catch (error) {
      message.error("Lỗi khi tải xã/phường.");
    }
  };

  const handleWardChange = (wardCode, option) => {
    setSelectedWardCode(wardCode);
    setSelectedWardName(option.children);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // Giữ ảnh cũ và lọc các ảnh mới hợp lệ
      const imageFiles = [
        ...fileList.filter(file => !file.originFileObj).map(file => file.url), // Ảnh cũ
        ...fileList.filter(file => file.originFileObj).map(file => file.originFileObj) // Ảnh mới
      ];

      // Nếu có đủ thông tin tỉnh, quận, phường, thì cập nhật lại địa chỉ
      if (selectedProvinceName && selectedDistrictName && selectedWardName) {
        values.address = `${values.address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
      }

      // Gọi API để cập nhật chi nhánh
      await updateFacility(facilityData.id, values, imageFiles);
      message.success("Chỉnh sửa chi nhánh thành công.");
      refreshFacilities();

      // Reset form và các giá trị
      form.resetFields();
      setImageFile(null);
      setImagePreviewUrl(null);
      onCancel();
    } catch (error) {
      message.error("Lỗi khi chỉnh sửa chi nhánh.");
      console.error("Error updating facility:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUploadChange = ({ fileList }) => {
    // Giữ nguyên ảnh cũ (có URL, không có originFileObj)
    const oldImages = fileList.filter(file => !file.originFileObj);

    // Lọc các ảnh mới hợp lệ
    const newImages = fileList.filter(
      file =>
        file.originFileObj &&
        (file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/webp")
    );

    // Cảnh báo nếu có ảnh mới không hợp lệ
    const invalidImages = fileList.filter(
      file => file.originFileObj && !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidImages.length > 0) {
      message.error("Chỉ chấp nhận file ảnh .jpg, .png hoặc .webp.");
    }

    setFileList([...oldImages, ...newImages]);
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Chi Nhánh"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Chi Nhánh"
          rules={[{ required: true, message: "Vui lòng nhập tên chi nhánh!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số Điện Thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="province" label="Tỉnh/Thành">
          <Select onChange={handleProvinceChange} placeholder="Chọn tỉnh thành">
            {provinces.map((province) => (
              <Option key={province.code} value={province.code}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="district" label="Quận/Huyện">
          <Select onChange={handleDistrictChange} placeholder="Chọn quận huyện">
            {districts.map((district) => (
              <Option key={district.code} value={district.code}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ward" label="Xã/Phường">
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
          <Input placeholder="Nhập địa chỉ (Số nhà, tên đường)!" />
        </Form.Item>
        <Form.Item name="images" label="Hình Ảnh">
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
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

export default EditFacilityModal;

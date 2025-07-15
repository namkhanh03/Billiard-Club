import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Spin, message } from "antd";
import { updateDrinkFood } from "services/drinkFoodService";
import { getAllCategories } from "services/categoryService";
import { getAllFacilities } from "services/facilityService";
import { getFacilityByUser } from "services/facilityUserService";

const { Option } = Select;

const EditFoodDrinkModal = ({ visible, onCancel, refreshDrinkFoods, foodData }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    foodData?.image || "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getAllCategories(1, 100);
        setCategories(categoryData.content);
      } catch {
        message.error("Lỗi khi tải danh mục.");
      }
    };

    const fetchFacilities = async () => {
      try {
        const facilityData = await getFacilityByUser(userData.userId);
        setFacilities(facilityData);
      } catch {
        message.error("Lỗi khi tải danh sách chi nhánh.");
      }
    };

    fetchCategories();
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (foodData) {
      form.setFieldsValue({
        name: foodData.name,
        description: foodData.description,
        price: foodData.price,
        categoryId: foodData.category?.id,
        facilityId: foodData.facility?.id,
        quantity: foodData.quantity,
        warningThreshold: foodData.warningThreshold,
      });
      setImagePreviewUrl(foodData.image || "https://via.placeholder.com/150");
    }
  }, [foodData, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateDrinkFood(
        foodData.id,
        values.name,
        values.price,
        values.description,
        values.categoryId,
        values.facilityId,
        values.quantity,
        values.warningThreshold,
        imageFile
      );
      refreshDrinkFoods();
      onCancel();
      message.success("Cập nhật món ăn/đồ uống thành công!");
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
        onCancel();
      } else {
        message.error("Đã xảy ra lỗi không xác định!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const isImage = file && (file.type === "image/jpeg" || file.type === "image/png");

    if (!isImage) {
      form.setFields([{ name: "image", errors: ["Vui lòng tải lên file ảnh .jpg hoặc .png."] }]);
      setImageFile(null);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Món Ăn / Đồ Uống"
      okText="Cập Nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Món Ăn / Đồ Uống"
          rules={[{ required: true, message: "Vui lòng nhập tên món ăn/đồ uống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VNĐ)"
          rules={[{ required: true, message: "Vui lòng nhập giá!", type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số Lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!", type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="warningThreshold"
          label="Mức Cảnh Báo"
          rules={[{ required: true, message: "Vui lòng nhập mức cảnh báo!", type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Danh Mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                <img
                  src={category.image || "https://via.placeholder.com/30"}
                  alt="Category"
                  width={30}
                  height={30}
                  style={{ marginRight: 10, borderRadius: "50%" }}
                />
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

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

        <Form.Item label="Hình Ảnh">
          <Input type="file" onChange={handleImageChange} accept=".jpg,.jpeg,.png" />
        </Form.Item>

        <img
          src={imagePreviewUrl}
          alt="Hình Ảnh Xem Trước"
          style={{ width: "50%", height: "auto", marginTop: "10px", borderRadius: "10%" }}
        />
      </Form>

      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
    </Modal>
  );
};

export default EditFoodDrinkModal;

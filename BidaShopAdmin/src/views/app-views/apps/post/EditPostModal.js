import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Spin, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { updatePost } from "services/postService";

const EditPostModal = ({ visible, onCancel, postData, refreshPosts }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(postData?.image || "https://i.pinimg.com/736x/13/aa/4e/13aa4e54ad0ad1b177591d427992cddb.jpg");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(postData?.content || "");
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    if (postData) {
      form.setFieldsValue({
        title: postData.title,
      });
      setContent(postData.content || "");
      setImagePreviewUrl(postData.image || "https://via.placeholder.com/150");
    }
  }, [postData, form]);

  const handleFinish = async (values) => {
    if (!content.trim()) {
      setContentError("Vui lòng nhập nội dung!");
      return;
    }

    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
      await updatePost(postData.id, values.title, content, imageFile, userData.id); // Gửi thêm postedById khi cập nhật
      refreshPosts();
      message.success("Cập nhật bài viết thành công!");
      setContentError(null);
      onCancel();
    } catch (error) {
      message.error("Lỗi khi cập nhật bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      form.setFields([{ name: "image", errors: ["Chỉ hỗ trợ file .jpg hoặc .png."] }]);
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
      title="Chỉnh Sửa Bài Viết"
      okText="Cập Nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={1000}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Tiêu Đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Nội Dung" required>
          <Editor
            apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g"
            value={content}
            onEditorChange={setContent}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar: "undo redo | styleselect | bold italic | link image | bullist numlist",
            }}
          />
          {contentError && <p style={{ color: "red" }}>{contentError}</p>}
        </Form.Item>

        <Form.Item name="image" label="Hình Ảnh">
          <Input type="file" onChange={handleImageChange} accept=".jpg,.jpeg,.png" />
        </Form.Item>

        <img src={imagePreviewUrl} alt="Xem trước" style={{ width: "50%", marginTop: "10px", borderRadius: "10%" }} />

        {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      </Form>
    </Modal>
  );
};

export default EditPostModal;

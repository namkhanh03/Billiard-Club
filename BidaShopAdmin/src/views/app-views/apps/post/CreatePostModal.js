import React, { useState } from "react";
import { Modal, Form, Input, Spin, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { createPost } from "services/postService";

const CreatePostModal = ({ visible, onCancel, refreshPosts }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://i.pinimg.com/736x/13/aa/4e/13aa4e54ad0ad1b177591d427992cddb.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // State lưu nội dung bài viết
  const [contentError, setContentError] = useState(null); // State để hiển thị lỗi

  const handleFinish = async (values) => {
    if (!content.trim()) {
      setContentError("Vui lòng nhập nội dung!");
      return;
    }
    if (!imageFile) {
      form.setFields([{ name: "image", errors: ["Vui lòng chọn hình ảnh!"] }]);
      return;
    }
    if (imageFile.size > 500 * 1024) {
      form.setFields([{ name: "image", errors: ["Hình ảnh không được vượt quá 500KB."] }]);
      return;
    }

    setLoading(true);
    try {
      await createPost(values.title, content, imageFile);
      refreshPosts();
      form.resetFields();
      setContent("");
      setImageFile(null);
      setImagePreviewUrl("https://via.placeholder.com/150");
      setContentError(null);
      onCancel();
      message.success("Thêm bài viết thành công!");
    } catch (error) {
      message.error("Lỗi khi tạo bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      form.setFields([{ name: "image", errors: ["Chỉ hỗ trợ file .jpg hoặc .png."] }]);
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
      title="Thêm Bài Viết"
      okText="Thêm"
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

        <Form.Item name="image" label="Hình Ảnh" rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}>
          <Input type="file" onChange={handleImageChange} accept=".jpg,.jpeg,.png" />
        </Form.Item>

        <img src={imagePreviewUrl} alt="Xem trước" style={{ width: "50%", marginTop: "10px", borderRadius: "10%" }} />

        {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      </Form>
    </Modal>
  );
};

export default CreatePostModal;

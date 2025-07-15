import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Spin,
  message,
  Tag,
  InputNumber,
  TimePicker,
  notification,
} from "antd";
import { updatePricing } from "services/pricingService";
import { DeleteOutlined } from "@ant-design/icons";
import { formatCurrency } from "utils/formatCurrency";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const EditPricingModal = ({ visible, onCancel, refreshPricings, pricingData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pricingDetails, setPricingDetails] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (pricingData) {
      form.setFieldsValue({
        description: pricingData.description,
      });
      setPricingDetails(pricingData.pricingDetails || []);
    }
  }, [pricingData, form]);

  const validateTimeSlots = (details) => {
    const timeSlots = details.map((detail) => detail.timeSlot);
    let totalDuration = 0;

    for (const slot of timeSlots) {
      const match = slot.match(/(\d{2}):(\d{2}) - (\d{2}):(\d{2}|00)/);
      if (match) {
        const start = parseInt(match[1]) * 60 + parseInt(match[2]);
        let end = parseInt(match[3]) * 60 + parseInt(match[4]);
        if (match[3] === "24" && match[4] === "00") end = 1440;

        if (start >= end) {
          message.error(`Khung giờ ${slot} không hợp lệ.`);
          return false;
        }
        totalDuration += end - start;
      } else {
        message.error(`Khung giờ ${slot} không đúng định dạng.`);
        return false;
      }
    }

    if (totalDuration < 1440) {
      message.error("Tổng thời gian các khung giờ chưa đủ 24 giờ.");
      return false;
    } else if (totalDuration > 1440) {
      message.error("Tổng thời gian các khung giờ vượt quá 24 giờ.");
      return false;
    }

    return true;
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (!validateTimeSlots(pricingDetails)) return;

      const updatedData = {
        description: values.description,
        pricingDetails,
      };

      await updatePricing(pricingData.id, updatedData);
      refreshPricings();
      onCancel();
      message.success("Cập nhật bảng giá thành công");
    } catch (error) {
      message.error("Cập nhật bảng giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPricingDetail = () => {
    if (!startTime || !endTime || price === "" || price === null) {
      notification.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ giờ bắt đầu, giờ kết thúc và giá.",
        placement: "topRight",
      });
      return;
    }

    const startStr = dayjs(startTime).format("HH:mm");
    let endStr = dayjs(endTime).format("HH:mm");

    if (endStr === "00:00" && dayjs(endTime).isBefore(startTime)) {
      endStr = "24:00";
    }

    const newStart = startTime.hour() * 60 + startTime.minute();
    const newEnd = endStr === "24:00" ? 1440 : endTime.hour() * 60 + endTime.minute();

    // Kiểm tra khung giờ mới có bị trùng với bất kỳ khung nào đã tồn tại
    const isOverlapping = pricingDetails.some((detail) => {
      const [start, end] = detail.timeSlot.split(" - ");
      const existingStart = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
      const existingEnd = end === "24:00" ? 1440 : parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);

      return !(newEnd <= existingStart || newStart >= existingEnd);
    });

    if (isOverlapping) {
      notification.error({
        message: "Khung giờ bị trùng",
        description: "Khung giờ này đã có giá được thiết lập. Vui lòng chọn khung khác.",
        placement: "topRight",
      });
      return;
    }

    const newDetail = {
      timeSlot: `${startStr} - ${endStr}`,
      price,
    };

    setPricingDetails([...pricingDetails, newDetail]);
    setStartTime(null);
    setEndTime(null);
    setPrice("");
  };

  const handleDeleteDetail = (index) => {
    const newDetails = pricingDetails.filter((_, i) => i !== index);
    setPricingDetails(newDetails);
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Bảng Giá"
      okText="Cập Nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="description"
          label="Mô Tả Bảng Giá"
          rules={[{ required: true, message: "Vui lòng nhập mô tả bảng giá!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Chi Tiết Bảng Giá">
          <div>
            {pricingDetails.map((detail, index) => (
              <Tag
                key={index}
                style={{
                  backgroundColor: "#ffe3cc",  // nền cam nhạt
                  color: "#ff7b1d",
                  fontWeight: "bold",
                  marginBottom: "5px",
                  marginRight: "5px",
                }}
              >
                {detail.timeSlot} - Giá: {formatCurrency(detail.price)}
                <DeleteOutlined
                  onClick={() => handleDeleteDetail(index)}
                  style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item label="Khung Giờ và Giá">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <TimePicker
              format="HH:mm"
              value={startTime}
              onChange={(value) => setStartTime(value)}
              placeholder="Giờ bắt đầu"
              minuteStep={5}
              style={{ width: "28%" }}
            />
            <TimePicker
              format="HH:mm"
              value={endTime}
              onChange={(value) => setEndTime(value)}
              placeholder="Giờ kết thúc"
              minuteStep={5}
              style={{ width: "28%" }}
            />
            <InputNumber
              value={price}
              onChange={setPrice}
              placeholder="Giá"
              style={{ width: "40%" }}
            />
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" onClick={handleAddPricingDetail}>
                Thêm chi tiết
              </Button>
            </div>
          </div>
        </Form.Item>

        <div style={{ marginTop: "10px", color: "#8c8c8c", fontSize: "12px" }}>
          <p><strong>Lưu ý:</strong></p>
          <ul>
            <li style={{ color: "#EE6457", fontSize: "14px" }}>
              Vui lòng nhập đúng khung giờ theo định dạng "HH:mm - HH:mm" và đảm bảo tổng thời gian không dưới hoặc vượt quá 24 giờ.
            </li>
            <li style={{ color: "#EE6457", fontSize: "14px" }}>
              Khung giờ phải bắt đầu từ 00:00 và kết thúc vào 24:00 (00:00 ngày hôm sau), ví dụ: 00:00 - 12:00, 12:00 - 18:00, 18:00 - 00:00.
            </li>
            <li style={{ color: "#EE6457", fontSize: "14px" }}>
              Các khung giờ phải kế tiếp nhau mà không có khoảng trống, ví dụ: 12:00 - 18:00 phải theo sau bởi 18:00 - 23:00.
            </li>
          </ul>
        </div>
        {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}
      </Form>
    </Modal>
  );
};

export default EditPricingModal;

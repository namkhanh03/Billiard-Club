import React, { useState } from "react";
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
import { createPricing } from "services/pricingService";
import { DeleteOutlined } from "@ant-design/icons";
import { formatCurrency } from "utils/formatCurrency";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const CreatePricingModal = ({ visible, onCancel, refreshPricings }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pricingDetails, setPricingDetails] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [price, setPrice] = useState("");

  const validateTimeSlots = (pricingDetails) => {
    const regex = /(\d{2}):(\d{2}) - (\d{2}):(\d{2})/;
    let totalDuration = 0;

    for (let i = 0; i < pricingDetails.length; i++) {
      const match = pricingDetails[i].timeSlot.match(regex);
      if (match) {
        const [_, sh, sm, eh, em] = match;
        const start = parseInt(sh) * 60 + parseInt(sm);
        const end = parseInt(eh) === 24 && parseInt(em) === 0 ? 1440 : parseInt(eh) * 60 + parseInt(em);

        if (start >= end) {
          message.error(`Khung giờ ${pricingDetails[i].timeSlot} không hợp lệ. Vui lòng kiểm tra lại.`);
          return false;
        }

        totalDuration += end - start;
      } else {
        message.error(`Khung giờ ${pricingDetails[i].timeSlot} không hợp lệ. Vui lòng nhập lại.`);
        return false;
      }
    }

    if (totalDuration < 1440) {
      message.error("Tổng thời gian các khung giờ chưa đủ 24 giờ. Vui lòng kiểm tra lại.");
      return false;
    } else if (totalDuration > 1440) {
      message.error("Tổng thời gian các khung giờ vượt quá 24 giờ. Vui lòng kiểm tra lại.");
      return false;
    }

    return true;
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (!validateTimeSlots(pricingDetails)) return;

      const pricingData = {
        description: values.description,
        pricingDetails,
      };

      await createPricing(pricingData);
      refreshPricings();
      form.resetFields();
      onCancel();
      message.success("Thêm bảng giá thành công");
    } catch (error) {
      message.error("Thêm bảng giá thất bại");
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

    let startStr = startTime.format("HH:mm");
    let endStr = endTime.format("HH:mm");

    if (endStr === "00:00") {
      endStr = "24:00";
    }

    const newStart = startTime.hour() * 60 + startTime.minute();
    const newEnd = endStr === "24:00" ? 1440 : endTime.hour() * 60 + endTime.minute();

    // Kiểm tra khung giờ mới có phút nào đã tồn tại trong khung giờ cũ không
    const isOverlapping = pricingDetails.some((detail) => {
      const [start, end] = detail.timeSlot.split(" - ");
      const existingStart = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
      const existingEnd = end === "24:00" ? 1440 : parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);

      // Nếu có sự giao nhau về mặt phút
      return !(newEnd <= existingStart || newStart >= existingEnd);
    });

    if (isOverlapping) {
      notification.error({
        message: "Khung giờ bị trùng",
        description: "Khung giờ này đã có giá được thiết lập. Vui lòng chọn khung giờ khác.",
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
    const newPricingDetails = pricingDetails.filter((_, i) => i !== index);
    setPricingDetails(newPricingDetails);
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Mới Bảng Giá"
      okText="Thêm"
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
              onChange={setStartTime}
              minuteStep={5}
              placeholder="Giờ bắt đầu"
              style={{ width: "28%" }}
            />
            <TimePicker
              format="HH:mm"
              value={endTime}
              onChange={setEndTime}
              minuteStep={5}
              placeholder="Giờ kết thúc"
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

export default CreatePricingModal;

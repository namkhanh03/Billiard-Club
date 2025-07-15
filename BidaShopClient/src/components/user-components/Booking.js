import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import { DatePicker, TimePicker, Button, Steps, message } from "antd";
import dayjs from "dayjs";
import useDebounce from "../../hooks/useDebounce";
import { getAllFacilities } from "../../services/facilityService";
import styles from "./CourseList.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FacilityCard from "./booking-components/FacilityCard";
import { createReservation } from "../../services/reservationService";

const { Step } = Steps;

const BookingFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const facilityIdParam = new URLSearchParams(location.search).get("facilityId");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getAllFacilities(1, 100);
        setFacilities(data.content);

        if (facilityIdParam) {
          const found = data.content.find(f => f.id.toString() === facilityIdParam);
          if (found) {
            setSelectedFacility(found);
            setCurrentStep(1);
          }
        }
      } catch (err) {
        setError("Không thể tải danh sách cơ sở");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [facilityIdParam]);

  const handleNext = () => {
    if (!selectedFacility) return message.warning("Vui lòng chọn chi nhánh trước");
    setCurrentStep(1);
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      message.warning("Vui lòng chọn ngày và giờ");
      return;
    }

    try {
      const formatted = `${selectedDate.format("YYYY-MM-DD")}T${selectedTime.format("HH:mm")}`;

      const userId = localStorage.getItem("userId"); // Hoặc lấy từ Redux/store nếu có

      const response = await createReservation({
        facilityId: selectedFacility.id,
        userId,
        reservationTime: formatted,
        status: "PENDING",
      });

      message.success("Đặt lịch thành công!");
      navigate("/booking-history");
    } catch (error) {
      console.error("Lỗi đặt lịch", error);
      message.error("Đặt lịch thất bại, vui lòng thử lại");
    }
  };

  const handleSelectFacility = useCallback((facility) => {
    setSelectedFacility(facility);
  }, []);

  if (loading)
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.errorDetail}>Vui lòng thử lại sau.</p>
      </div>
    );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.containerFull}>
      <div className={styles.coursesListContainer}>
        <h2 className={styles.coursesTitle} style={{ color: "#ff7b1d" }}>Đặt lịch tại chi nhánh</h2>

        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title={<span style={{ color: "#fff" }}>Chọn chi nhánh</span>} />
          <Step title={<span style={{ color: "#fff" }}>Chọn thời gian</span>} />
        </Steps>

        {currentStep === 0 && (
          <>
            <p style={{ color: "#fff" }}>Chọn chi nhánh:</p>
            <Slider {...settings}>
              {facilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  selectedId={selectedFacility?.id}
                  onSelect={handleSelectFacility}
                />
              ))}
            </Slider>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button type="primary" style={{ backgroundColor: "#ff7b1d", border: "none" }} onClick={handleNext}>
                Tiếp tục
              </Button>
            </div>
          </>
        )}

        {currentStep === 1 && selectedFacility && (
          <div style={{ color: "#fff", maxWidth: 480, margin: "0 auto" }}>
            <h3 style={{ color: "#ff7b1d", textAlign: "center" }}>Chọn ngày và giờ</h3>
            <div style={{ marginBottom: 16 }}>
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date) => setSelectedDate(date)}
                disabledDate={(current) =>
                  current && (current < dayjs().startOf("day") || current > dayjs().add(7, "day"))
                }
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
                onChange={(time) => setSelectedTime(time)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: 16 }}>
              <Button onClick={handlePrevious}>Quay lại</Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#ff7b1d", border: "none" }}
                onClick={handleConfirm}
              >
                Xác nhận đặt lịch
              </Button>
            </div>
            <div
              style={{
                color: "#e96200",
                fontSize: "16px",
                marginTop: 16,
                backgroundColor: "#fff3e6",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #e96200"
              }}
            >
              <strong>Lưu ý:</strong>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
                <li>- Hệ thống chỉ giữ bàn trong <strong>10 phút</strong> sau thời gian đã đặt.</li>
                <li>- Nếu trong thời gian đó chưa có bàn trống, bạn sẽ <strong>phải chờ thêm</strong> cho đến khi có bàn.</li>
                <li>- Thông tin cá nhân của bạn sẽ được dùng để làm thông tin đặt lịch.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default BookingFacility;

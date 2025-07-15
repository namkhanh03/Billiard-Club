import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import styles from "./CourseDetail.module.css";
import { getFacilityById } from "../../services/facilityService";
import { getAllBilliardTables } from "../../services/billiardTableService";
import { formatCurrency } from "../../utils/formatCurrency";
import DrinkListModal from "./facility-components/DrinkListModal";

const FacilityDetail = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const rightColumnRef = useRef();
  const [leftHeight, setLeftHeight] = useState("auto");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const data = await getFacilityById(id);
        setFacility(data);
        setMainImage(data.images?.[0]?.imageUrl || "/default-image.jpg");
      } catch (err) {
        setError("Không thể tải thông tin chi nhánh");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchTables = async () => {
      try {
        const data = await getAllBilliardTables(1, 100, "", id, userId);
        setTables(data.content || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bàn", err);
      }
    };

    if (id) fetchTables();
  }, [id]);

  useEffect(() => {
    const updateHeight = () => {
      if (rightColumnRef.current) {
        setLeftHeight(rightColumnRef.current.clientHeight + "px");
      }
    };

    setTimeout(updateHeight, 200);

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [facility]);

  const handleBack = () => navigate("/list-facility");

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

  if (!facility)
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <p className={styles.errorMessage}>Không tìm thấy chi nhánh</p>
        <p className={styles.errorDetail}>Vui lòng kiểm tra lại đường dẫn.</p>
      </div>
    );

  const { name, address, phoneNumber, isActive, createdAt, images } = facility;

  return (
    <div className={styles.courseDetails}>
      <div className="container">
        <div className={styles.courseDetailsWrapper}>
          <div className={styles.courseHeader}>
            <h1 className={styles.courseTitle}>{name}</h1>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div
                className="d-flex flex-column gap-3"
                style={{ height: leftHeight, overflow: "auto" }}
              >
                <img
                  src={mainImage}
                  alt="Main"
                  className="img-fluid rounded"
                  style={{ maxHeight: "60%", objectFit: "cover" }}
                />

                {images?.length > 1 && (
                  <div className="d-flex flex-wrap gap-2">
                    {images.map((img) => (
                      <img
                        key={img.id}
                        src={img.imageUrl}
                        alt="sub"
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100%",
                          cursor: "pointer",
                          border:
                            img.imageUrl === mainImage
                              ? "2px solid #ff7b1d"
                              : "1px solid #ccc",
                        }}
                        onClick={() => setMainImage(img.imageUrl)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6" ref={rightColumnRef}>
              <div className={styles.courseDescriptionSection}>
                <div className={styles.sectionTitle}>
                  <h2 style={{ color: "#fff" }}>Thông tin chi nhánh</h2>
                </div>

                <p style={{ color: "#fff" }}>
                  <strong>Địa chỉ:</strong>{" "}
                  <a
                    style={{ color: "#ff7b1d", textDecoration: "underline" }}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </a>
                </p>

                <p style={{ color: "#fff" }}>
                  <strong>Số điện thoại:</strong> {phoneNumber}
                </p>

                <p style={{ color: "#fff" }}>
                  <strong>Trạng thái:</strong>{" "}
                  <span>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        backgroundColor: isActive ? "#52c41a" : "#f5222d",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </span>
                </p>

                <div className="mt-3 mb-4 d-flex gap-2">
                  <button
                    className={styles.detailsBtn}
                    onClick={() => setDrinkModalVisible(true)}
                  >
                    Xem thực đơn
                  </button>
                </div>

                <div className="mt-3">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    width="100%"
                    height="250"
                    style={{ border: "0", borderRadius: "8px" }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h2 style={{ color: "#fff" }}>Danh sách bàn</h2>
            <div className="row">
              {tables.length === 0 ? (
                <p style={{ color: "#ccc", paddingLeft: "15px" }}>
                  Không có bàn nào trong chi nhánh này.
                </p>
              ) : (
                tables.map((table) => (
                  <div key={table.id} className="col-md-4 mb-4">
                    <div
                      style={{
                        border: "1px solid #ff7b1d",
                        borderRadius: "10px",
                        padding: "12px",
                        backgroundColor: "#1e1e1e",
                        color: "#fff",
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/8058/8058058.png"
                        alt="Billiard Table"
                        style={{
                          width: "80px",
                          height: "100%",
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <h5 style={{ color: "#ff7b1d", marginBottom: "6px" }}>{table.name}</h5>

                        <p style={{ fontSize: "0.95rem", marginBottom: "6px" }}>
                          Trạng thái:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color:
                                table.status === "Available"
                                  ? "#52c41a"
                                  : table.status === "In Use"
                                  ? "#f5222d"
                                  : "#ccc",
                            }}
                          >
                            {table.status === "Available"
                              ? "Có sẵn"
                              : table.status === "In Use"
                              ? "Đang sử dụng"
                              : "Không xác định"}
                          </span>
                        </p>

                        {table.pricing?.pricingDetails?.length > 0 && (
                          <div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "4px" }}>
                              Bảng Giá:
                            </p>
                            <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
                              {table.pricing.pricingDetails.map((slot) => (
                                <li key={slot.id} style={{ fontSize: "0.85rem" }}>
                                  <span style={{ color: "#ff7b1d" }}>{slot.timeSlot}</span>: {formatCurrency(slot.price)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DrinkListModal open={drinkModalVisible} onClose={() => setDrinkModalVisible(false)} facilityId={id}/>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail; 
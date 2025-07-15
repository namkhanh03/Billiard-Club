import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, DatePicker, message, Spin, Empty, Tag, Pagination } from "antd";
import { WarningOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import styles from './UserHistory.module.css'; // Sửa lại tên file CSS
import { getAllOrders } from "../../services/orderService"; // Sử dụng hàm getAllOrders thay vì getAllReservations
import { formatCurrency } from "../../utils/formatCurrency";
import OrderDetailModal from "./OrderDetailModal";

const UserHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đã chọn để hiển thị chi tiết
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const limit = 5; // Số lượng đơn hàng trên mỗi trang

  // Hàm gọi API lấy tất cả đơn hàng
  const fetchOrders = useCallback(async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const userId = localStorage.getItem("userId");
      const params = {
        page: currentPage,
        limit,
        customerId: userId,
        keyword: '', // Có thể bổ sung từ khóa tìm kiếm nếu cần
        date: filterDate ? dayjs(filterDate).format("YYYY-MM-DD") : undefined,
      };
      const data = await getAllOrders(params.page, params.limit, params.keyword, params.customerId);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lịch sử chơi:", err);
      setError("Không thể tải danh sách lịch sử chơi.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Thay đổi trang
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      PENDING: "gold",
      CONFIRMED: "green",
      COMPLETE: "blue",
      CANCEL: "red",
    };

    const labelMap = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      COMPLETE: "Hoàn thành",
      CANCEL: "Đã hủy",
    };

    return (
      <Tag color={colorMap[status] || "default"} style={{ fontWeight: 500 }}>
        {labelMap[status] || status}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: ["customer", "fullName"],
      key: "customerFullName",
      render: (text, record) => {
        const customer = record?.customer;
        const avatar = customer?.avatar;
        const fullName = customer?.fullName || "Khách lẻ";

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={avatar || "https://cdn-icons-png.flaticon.com/128/4577/4577207.png"}
              alt={fullName}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 10,
                objectFit: "cover",
              }}
            />
            {fullName}
          </div>
        );
      },
    },
    {
      title: "Số Điện Thoại",
      dataIndex: ["customer", "phoneNumber"],
      key: "customerPhoneNumber",
      render: (text, record) => record?.customer?.phoneNumber || record?.customerPhone,
    },
    {
      title: "Nhân viên",
      dataIndex: ["staff", "fullName"],
      key: "staffFullName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Customer Avatar */}
          <img
            src={record.staff.avatar}
            alt={record.staff.fullName}
            style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Bàn",
      dataIndex: ["table", "name"],
      key: "tableName",
    },
    {
      title: "Chi Nhánh",
      dataIndex: ["table", "facility", "name"],
      key: "facilityName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Facility Image */}
          <img
            src={record.table.facility.images[0]?.imageUrl}
            alt={text}
            style={{ width: 40, height: 40, borderRadius: "5px", marginRight: 10 }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Tổng hóa đơn",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `${formatCurrency(text)}`,
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" type="primary" onClick={() => handleViewDetail(record)}>
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  // Hàm xử lý khi nhấn vào "Xem chi tiết"
  const handleViewDetail = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn
    setIsModalVisible(true); // Hiển thị modal chi tiết đơn hàng
  };

  // Hàm đóng modal chi tiết đơn hàng
  const handleCloseModal = () => {
    setIsModalVisible(false); // Ẩn modal
    setSelectedOrder(null); // Xóa đơn hàng đã chọn
  };
  // Xử lý khi chưa có dữ liệu
  if (loading) return <div style={{ textAlign: "center", paddingTop: 100 }}><Spin size="large" /></div>;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.errorDetail}>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
      </div>
    );
  }

  // Nếu không có đơn hàng
  if (!orders.length) {
    return (
      <div className={styles.ordersPage}>
        <h2 className={styles.title}>Lịch sử chơi</h2>
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <Empty description={<span style={{ color: 'white' }}>Bạn chưa có lịch sử chơi nào</span>}  style={{ padding: 80 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <h2 className={styles.title}>Lịch sử chơi</h2>

      <div style={{ marginBottom: 20, textAlign: "center" }}>

      </div>

      <div style={{ padding: '0 100px' }}>
        <Table
          columns={columns}
          dataSource={orders}
          pagination={false}
          rowKey={(record) => record.id}
        />

        {/* Phân trang */}
        <Pagination
          current={currentPage}
          total={totalPages * limit}
          pageSize={limit}
          onChange={handlePageChange}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
        {selectedOrder && (
          <OrderDetailModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            selectedOrder={selectedOrder}
            fetchOrdersData={fetchOrders}
          />
        )}
      </div>
    </div>
  );
};

export default UserHistory;

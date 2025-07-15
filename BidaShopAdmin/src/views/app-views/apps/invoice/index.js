import {
  Table,
  Button,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Select,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllOrders } from "services/orderService";
import { debounce } from "lodash";
import { formatCurrency } from "utils/formatCurrency";
import OrderDetailModal from "./OrderDetailModal";
import { getFacilityByUser } from "services/facilityUserService";

const { Option } = Select;

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const limit = 10;

  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchFacilities = useCallback(async () => {
    try {
      const data = await getFacilityByUser(userData.userId);
      setFacilities(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách cơ sở.");
    }
  }, [userData.userId]);

  const fetchOrders = useCallback(
    async (page = currentPage, facilityId = selectedFacility) => {
      setLoading(true);
      try {
        const data = await getAllOrders(
          page,
          limit,
          orderId || "",
          customerName || "",
          phone || "",
          facilityId
        );
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, selectedFacility, orderId, customerName, phone]
  );

  const debouncedFetchOrderId = useCallback(
    debounce((value) => {
      setOrderId(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const debouncedFetchCustomerName = useCallback(
    debounce((value) => {
      setCustomerName(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const debouncedFetchPhone = useCallback(
    debounce((value) => {
      setPhone(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchOrders(currentPage, selectedFacility);
  }, [fetchOrders, currentPage, selectedFacility, orderId, customerName, phone]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExportCsv = async () => {
  setLoading(true);
  try {
    const data = await getAllOrders(
      1,
      100,
      orderId || "",
      customerName || "",
      phone || "",
      selectedFacility
    );

    const exportData = data.content.map(order => ({
      id: order.id,
      customerFullName: order.customer?.fullName || "Khách lẻ",
      customerPhone: order.customerPhone || "Không cung cấp",
      staffFullName: order.staff?.fullName || "",
      tableName: order.table?.name || "",
      facilityName: order.table?.facility?.name || "",
      totalAmount: order.totalAmount,
    }));

    const header = [
      "Mã hóa đơn",
      "Tên khách hàng",
      "Số điện thoại",
      "Nhân viên",
      "Bàn",
      "Chi nhánh",
      "Tổng hóa đơn"
    ];

    const csvRows = [
      header.join(","), 
      ...exportData.map(order =>
        [
          order.id,
          `"${order.customerFullName}"`,
          `"${order.customerPhone}"`,
          `"${order.staffFullName}"`,
          `"${order.tableName}"`,
          `"${order.facilityName}"`,
          order.totalAmount
        ].join(",")
      )
    ];

    const csvString = csvRows.join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success("Đã xuất file orders.csv thành công");
  } catch (error) {
    message.error("Lỗi khi xuất file CSV.");
  } finally {
    setLoading(false);
  }
};

  const handleExportJson = async () => {
  setLoading(true);
  try {
    const data = await getAllOrders(
      1, 
      100, 
      orderId || "",
      customerName || "",
      phone || "",
      selectedFacility
    );
    const exportData = data.content.map(order => ({
      id: order.id,
      customerFullName: order.customer?.fullName || "Khách lẻ",
      customerPhone: order.customerPhone || "Không cung cấp",
      staffFullName: order.staff?.fullName || "",
      tableName: order.table?.name || "",
      facilityName: order.table?.facility?.name || "",
      totalAmount: order.totalAmount,
    }));

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("Đã xuất file orders.json thành công!");
  } catch (error) {
    message.error("Lỗi khi xuất file JSON.");
  } finally {
    setLoading(false);
  }
};

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: ["customer", "fullName"],
      key: "customerFullName",
      render: (text, record) => {
        const fullName = record?.customer?.fullName || "Khách lẻ";
        return <div>{fullName}</div>;
      },
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      render: (text) => text || "Không cung cấp",
    },
    {
      title: "Nhân viên",
      dataIndex: ["staff", "fullName"],
      key: "staffFullName",
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
    },
    {
      title: "Tổng hóa đơn",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Button size="small" type="primary" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div>

        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Mã hóa đơn"
            onChange={(e) => debouncedFetchOrderId(e.target.value)}
            style={{ width: "24%" }}
          />
          <Input
            placeholder="Tên khách hàng"
            onChange={(e) => debouncedFetchCustomerName(e.target.value)}
            style={{ width: "24%" }}
          />
          <Input
            placeholder="Số điện thoại KH"
            onChange={(e) => debouncedFetchPhone(e.target.value)}
            style={{ width: "24%" }}
          />
          <Select
            style={{ width: "24%" }}
            placeholder="Chọn cơ sở"
            allowClear
            value={selectedFacility}
            onChange={(value) => {
              setSelectedFacility(value);
              setCurrentPage(1);
            }}
          >
            {facilities.map((facility) => (
              <Option key={facility.id} value={facility.id}>
                {facility.name}
              </Option>
            ))}
          </Select>
        <Button
          size="small" type="primary" onClick={handleExportJson}
        >
          Export JSON
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={orders}
              pagination={false}
              rowKey={(record) => record.id}
            />
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          fetchOrdersData={fetchOrders}
        />
      )}
    </Card>
  );
}
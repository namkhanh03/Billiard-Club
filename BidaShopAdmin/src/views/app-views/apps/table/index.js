import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Tag,
  Switch,
  Select,
  Image,
  Modal,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllBilliardTables,
  deleteBilliardTable,
  toggleBilliardTableActive,
} from "services/billiardTableService";
import { getAllFacilities } from "services/facilityService"; // Thêm API lấy danh sách cơ sở
import { debounce } from "lodash";
import { EyeOutlined } from '@ant-design/icons';
import CreateBilliardTableModal from "./CreateBilliardTableModal";
import EditBilliardTableModal from "./EditBilliardTableModal";
import { getFacilityByUser } from "services/facilityUserService";
import { formatCurrency } from "utils/formatCurrency";

const { Option } = Select;

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [facilities, setFacilities] = useState([]); // Danh sách cơ sở
  const [selectedFacility, setSelectedFacility] = useState(null); // Cơ sở được chọn
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editTableData, setEditTableData] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pricingDetailModalVisible, setPricingDetailModalVisible] = useState(false); // Để hiển thị modal chi tiết bảng giá
  const [selectedPricingDetails, setSelectedPricingDetails] = useState(null);
  const limit = 10;
  const userData = JSON.parse(localStorage.getItem("user"));
  // ✅ Hàm lấy danh sách bàn bi-a
  const fetchTables = useCallback(
    async (search = searchTerm, page = currentPage, facilityId = selectedFacility) => {
      setLoading(true);
      try {
        const data = await getAllBilliardTables(page, limit, search, facilityId, userData.userId);
        setTables(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách bàn bi-a.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, selectedFacility]
  );

  // ✅ Hàm lấy danh sách cơ sở
  const fetchFacilities = useCallback(async () => {
    try {
      const data = await getFacilityByUser(userData.userId); // Lấy toàn bộ danh sách facility
      setFacilities(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách cơ sở.");
    }
  }, []);

  // ✅ Hàm debounce tìm kiếm
  const debouncedFetchTables = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchTables(value, 1, selectedFacility);
    }, 800),
    [fetchTables, selectedFacility]
  );

  // ✅ Gọi API khi trang, từ khóa tìm kiếm hoặc cơ sở thay đổi
  useEffect(() => {
    fetchFacilities(); // Lấy danh sách cơ sở ngay từ đầu
    fetchTables(searchTerm, currentPage, selectedFacility);
  }, [fetchTables, fetchFacilities, currentPage, selectedFacility]);

  // ✅ Xóa bàn bi-a
  const confirmDeleteTable = async (tableId) => {
    try {
      await deleteBilliardTable(tableId);
      message.success("Đã xóa bàn bi-a.");
      fetchTables();
    } catch (error) {
      message.error("Lỗi khi xóa bàn bi-a.");
    }
  };

  // ✅ Cập nhật trạng thái bàn bi-a (Bật/Tắt)
  const handleToggleActive = async (tableId, isActive) => {
    try {
      await toggleBilliardTableActive(tableId, !isActive);
      message.success(`Đã ${isActive ? "vô hiệu hóa" : "kích hoạt"} bàn bi-a.`);
      fetchTables();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái bàn bi-a.");
    }
  };

  // ✅ Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Mở modal chỉnh sửa bàn bi-a
  const handleEditClick = (record) => {
    setEditTableData(record);
    setIsEditOpen(true);
  };
  const handlePricingDetailClick = (pricingDetails) => {
    setSelectedPricingDetails(pricingDetails);
    setPricingDetailModalVisible(true);
  };

  // ✅ Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã bàn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên bàn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "Available" ? "Có sẵn" : "Đang sử dụng"),
    },
    {
      title: "Cơ sở",
      dataIndex: "facility",
      key: "facility",
      render: (facility) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src={facility?.images[0].imageUrl || "https://via.placeholder.com/50"}
            alt="Facility"
            width={40}
            height={40}
            style={{ borderRadius: "10%", marginRight: "10px" }}
          />
          {facility?.name || "Không có dữ liệu"}
        </div>
      ),
    },
    {
      title: "Bảng giá",
      dataIndex: "pricing",
      key: "pricing",
      render: (pricing) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{pricing?.description || "Chưa cập nhật bảng giá"}</span>
          {pricing?.description && <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handlePricingDetailClick(pricing?.pricingDetails)}
          />}
        </div>
      ),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Kích Hoạt",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive, record) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${isActive ? "vô hiệu hóa" : "kích hoạt"} bàn này không?`}
          onConfirm={() => handleToggleActive(record.id, isActive)}
          okText="Có"
          cancelText="Không"
        >
          <Switch checked={isActive} />
        </Popconfirm>
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" size="small" onClick={() => handleEditClick(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bàn này?"
            onConfirm={() => confirmDeleteTable(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" style={{ marginLeft: "10px" }}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          placeholder="Tìm kiếm bàn bi-a..."
          allowClear
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debouncedFetchTables(e.target.value);
          }}
          style={{ width: "40%" }}
        />
        <Select
          style={{ width: "30%" }}
          placeholder="Chọn cơ sở"
          allowClear
          onChange={(value) => {
            setSelectedFacility(value);
            setCurrentPage(1);
          }}
        >
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
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Thêm mới bàn
        </Button>
      </div>

      <Table columns={columns} dataSource={tables} pagination={false} rowKey={(record) => record.id} />
      <Pagination current={currentPage} total={totalPages * limit} pageSize={limit} onChange={handlePageChange} style={{ marginTop: "20px", textAlign: "center" }} />
      <CreateBilliardTableModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshTables={fetchTables}
      />
      <EditBilliardTableModal
        visible={isEditOpen}
        tableData={editTableData}
        refreshTables={fetchTables}
        onCancel={() => setIsEditOpen(false)}
      />
      <Modal
        visible={pricingDetailModalVisible}
        title="Chi Tiết Bảng Giá"
        onCancel={() => setPricingDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPricingDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div>
          {selectedPricingDetails?.map((detail, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: "5px", marginRight: "5px" }}>
              {detail.timeSlot} - Giá: {formatCurrency(detail.price)}
            </Tag>
          ))}
        </div>
      </Modal>
    </Card>
  );
}

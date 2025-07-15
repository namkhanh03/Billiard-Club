import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Switch,
  Select,
  Image,
  Tag,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllPricings,
  deletePricing,
  updatePricing,
} from "services/pricingService";
import { debounce } from "lodash";
import { formatCurrency } from "utils/formatCurrency";
import CreatePricingModal from "./CreatePricingModal"; // Modal tạo mới bảng giá
import EditPricingModal from "./EditPricingModal"; // Modal chỉnh sửa bảng giá

const { Option } = Select;

export default function PricingManagement() {
  const [pricings, setPricings] = useState([]); // Danh sách bảng giá
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedFacility, setSelectedFacility] = useState(null); // Cơ sở được chọn
  const [editPricingData, setEditPricingData] = useState(null); // Dữ liệu để chỉnh sửa bảng giá
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái modal tạo mới bảng giá
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái modal chỉnh sửa bảng giá
  const limit = 10;

  // ✅ Hàm lấy danh sách bảng giá
  const fetchPricings = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const data = await getAllPricings(page, limit, search);
        setPricings(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách bảng giá.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit]
  );

  // ✅ Hàm debounce tìm kiếm
  const debouncedFetchPricings = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchPricings(value, 1);
    }, 800),
    [fetchPricings]
  );

  // ✅ Gọi API khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchPricings(searchTerm, currentPage);
  }, [fetchPricings, currentPage]);

  // ✅ Xóa bảng giá
  const confirmDeletePricing = async (pricingId) => {
    try {
      await deletePricing(pricingId);
      message.success("Đã xóa bảng giá.");
      fetchPricings();
    } catch (error) {
      message.error("Lỗi khi xóa bảng giá.");
    }
  };

  // ✅ Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Mở modal chỉnh sửa bảng giá
  const handleEditClick = (record) => {
    setEditPricingData(record);
    setIsEditOpen(true);
  };

  // ✅ Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã bảng giá",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Chi Tiết Giá",
      key: "pricingDetails", // Chỉ định cột cho PricingDetail
      render: (text, record) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {record.pricingDetails?.map((detail, index) => (
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
            </Tag>
          ))}
        </div>
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
            title="Bạn có chắc muốn xóa bảng giá này?"
            onConfirm={() => confirmDeletePricing(record.id)}
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
          placeholder="Tìm kiếm bảng giá theo mô tả..."
          allowClear
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debouncedFetchPricings(e.target.value);
          }}
          style={{ width: "40%" }}
        />
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Thêm mới bảng giá
        </Button>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table columns={columns} dataSource={pricings} pagination={false} rowKey={(record) => record.id} />
          <Pagination
            current={currentPage}
            total={totalPages * limit}
            pageSize={limit}
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </>
      )}
      <CreatePricingModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshPricings={fetchPricings}
      />
      <EditPricingModal
        visible={isEditOpen}
        pricingData={editPricingData}
        refreshPricings={fetchPricings}
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}

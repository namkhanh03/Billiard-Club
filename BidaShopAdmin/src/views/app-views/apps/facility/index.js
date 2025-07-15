import {
  Table,
  Button,
  Modal,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Image,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllFacilities, deleteFacility, deleteFacilityImage } from "services/facilityService"; // Add deleteFacilityImage to the import
import { debounce } from "lodash";
import { DeleteOutlined } from '@ant-design/icons';
import CreateFacilityModal from "./CreateFacilityModal"; // Modal tạo mới facility
import EditFacilityModal from "./EditFacilityModal"; // Modal chỉnh sửa facility

export default function FacilityManagement() {
  const [facilities, setFacilities] = useState([]); // State lưu trữ danh sách facility
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editFacilityData, setEditFacilityData] = useState(null); // Dữ liệu để chỉnh sửa facility
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới facility
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa facility
  const limit = 10; // Số lượng facility trên mỗi trang
  const userData = JSON.parse(localStorage.getItem("user"));
  const [showAllImages, setShowAllImages] = useState(false);

  // Hàm lấy facility
  const fetchFacilities = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllFacilities(page, limit, search, userData.userId); // Gọi API lấy facility
        setFacilities(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy chi nhánh.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit, searchTerm, userData.userId]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchFacilities = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchFacilities(value, 1); // Gọi hàm lấy facility với trang 1
    }, 800),
    [fetchFacilities]
  );

  // Lấy facility khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchFacilities(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchFacilities, currentPage]);

  // Hàm xóa facility
  const confirmDeleteFacility = async (facilityId) => {
    Modal.confirm({
      title: "Xác nhận xóa chi nhánh",
      content: (
        <div>
          <p>Bạn có chắc muốn xóa chi nhánh này?</p>
          <p>
            Lưu ý: Khi xóa chi nhánh, tất cả các bàn bida của chi nhánh này cũng sẽ bị xóa.
          </p>
        </div>
      ),
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteFacility(facilityId); // Gọi API xóa facility
          message.success("Đã xóa facility.");
          fetchFacilities(); // Lấy lại facility sau khi xóa
        } catch (error) {
          message.error("Lỗi khi xóa facility.");
        }
      },
    });
  };

  // Hàm xóa hình ảnh của facility
  const confirmDeleteImage = async (imageId, facilityId) => {
    Modal.confirm({
      title: "Xác nhận xóa hình ảnh",
      content: "Bạn có chắc muốn xóa hình ảnh này?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteFacilityImage(imageId); // Gọi API xóa hình ảnh
          message.success("Đã xóa hình ảnh.");
          fetchFacilities(); // Lấy lại danh sách facility sau khi xóa hình ảnh
        } catch (error) {
          message.error("Lỗi khi xóa hình ảnh.");
        }
      },
    });
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditFacilityData(record); // Lưu trữ dữ liệu facility để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
        {
      title: "Mã chi nhánh",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Bản Đồ",
      dataIndex: "address",
      key: "map",
      render: (address) => (
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          width="200"
          height="150"
          style={{ border: "0", borderRadius: "8px" }}
          allowFullScreen
        ></iframe>
      ),
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone !== "undefined" && phone ? phone : "Chưa có",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
      render: (images, record) => {
        // State to toggle image visibility

        // Handle show/hide all images
        const toggleImageVisibility = () => {
          setShowAllImages(!showAllImages);
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {/* Display the images */}
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {(showAllImages ? images : images.slice(0, 3)).map((image) => (
                <div key={image.id} style={{ position: "relative" }}>
                  <Image
                    src={image.imageUrl}
                    alt="Facility"
                    width={80}
                    height={80}
                    style={{ borderRadius: "10%" }}
                  />
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    ghost // Makes the button red with white text
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      zIndex: 10,
                    }}
                    onClick={() => confirmDeleteImage(image.id, record.id)}
                  />

                </div>
              ))}
            </div>

            {/* If there are more than 3 images, show the button to toggle visibility */}
            {images.length > 3 && (
              <Button
                size="small"
                style={{ marginTop: "5px" }}
                onClick={toggleImageVisibility}
              >
                {showAllImages ? 'Ẩn bớt' : `Xem thêm (${images.length - 3})`}
              </Button>
            )}
          </div>
        );
      },
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
          <Button
            size="small"
            style={{ marginLeft: "10px" }}
            onClick={() => confirmDeleteFacility(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm chi nhánh..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchFacilities(e.target.value);
            }}
            style={{ width: "75%" }}
          />
          {userData.role === "ADMIN" && (
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>
              Thêm mới chi nhánh
            </Button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={facilities}
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
      <CreateFacilityModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshFacilities={fetchFacilities}
      />
      <EditFacilityModal
        visible={isEditOpen}
        facilityData={editFacilityData}
        refreshFacilities={fetchFacilities}
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}

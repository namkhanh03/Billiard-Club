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
  Image,
  Select,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, deleteUser, getAllStaff } from "services/userService"; // Import service cho user
import { debounce } from "lodash";
import CreateUserModal from "./CreateUserModal"; // Modal cho tạo mới user
import EditUserModal from "./EditUserModal"; // Modal cho chỉnh sửa user
import UpdateUserFacilityModal from "./UpdateUserFacilityModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State lưu trữ danh sách user
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editUserData, setEditUserData] = useState(null); // Dữ liệu để chỉnh sửa user
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới user
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa user
  const [selectedRole, setSelectedRole] = useState(""); // Lưu vai trò đã chọn
  const limit = 10; // Số lượng user trên mỗi trang
  const [isUpdateFacilityOpen, setIsUpdateFacilityOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const roleOptions = [
    { value: "", label: "Tất cả vai trò", color: "default" },
    { value: "ADMIN", label: "Quản trị viên", color: "red" },
    { value: "STAFF", label: "Nhân viên", color: "orange" },
    { value: "MANAGER", label: "Quản lý", color: "blue" },
  ];
  // Hàm lấy người dùng
  const fetchUsers = useCallback(
    async (search = searchTerm, page = currentPage, role = selectedRole) => {
      setLoading(true);
      try {
        const data = await getAllStaff(page, limit, search, role); // Thêm role vào API call
        setUsers(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy người dùng.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit]
  );


  // Hàm debounce tìm kiếm
  const debouncedFetchUsers = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchUsers(value, 1); // Gọi hàm lấy user với trang 1
    }, 800),
    [fetchUsers]
  );

  // Lấy người dùng khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchUsers(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchUsers, currentPage]);

  // Hàm xóa người dùng
  const confirmDeleteUser = async (userId) => {
    try {
      await deleteUser(userId); // Gọi API xóa user
      message.success("Đã xóa người dùng.");
      fetchUsers(); // Lấy lại danh sách user sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa người dùng.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditUserData(record); // Lưu trữ dữ liệu user để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };
  const handleUpdateFacilityClick = (userId) => {
    setSelectedUserId(userId);
    setIsUpdateFacilityOpen(true);
  };
  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã tài khoản",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Tên Nhân Sự",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ảnh Đại Diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <Image
          src={text || "https://via.placeholder.com/50"}
          alt="User"
          width={50}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },

    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleMapping = {
          ADMIN: { color: "red", label: "Quản trị viên" },
          STAFF: { color: "orange", label: "Nhân viên" },
          CUSTOMER: { color: "green", label: "Khách hàng" },
          MANAGER: { color: "blue", label: "Quản lý" },
        };

        return (
          <Tag color={roleMapping[role]?.color || "default"}>
            {roleMapping[role]?.label || role}
          </Tag>
        );
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {/* Nút Sửa */}
          <Button
            type="primary" // Màu xanh (blue)
            size="small"
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>

          {/* Nút Xóa */}
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => confirmDeleteUser(record.userId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger // Màu đỏ (red)
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>

          {/* Nút Cập Nhật Chi Nhánh */}
          {record.role !== "CUSTOMER" && <Button
            type="success"
            size="small"
            onClick={() => handleUpdateFacilityClick(record.userId)}
          >
            Cập nhật chi nhánh
          </Button>}
        </div>

      ),
    },
  ];

  return (
    <Card>
      <div>
        {/* Ô tìm kiếm và nút thêm mới user */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm người dùng bằng Họ Tên / Email/ SĐT"
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchUsers(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "55%" }}
          />
          <Select
            placeholder="Chọn vai trò"
            allowClear
            style={{ width: "25%" }}
            value={selectedRole}
            onChange={(value) => {
              setSelectedRole(value);
              fetchUsers(searchTerm, 1, value); // Fetch user theo role
            }}
          >
            {roleOptions.map((role) => (
              <Select.Option key={role.value} value={role.value}>
                <Tag color={role.color}>{role.label}</Tag>
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Nhân Sự
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng user */}
            <Table
              columns={columns}
              dataSource={users}
              pagination={false}
              rowKey={(record) => record.userId}
            />

            {/* Phân trang */}
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
      <CreateUserModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshUsers={fetchUsers}
      />
      <EditUserModal
        visible={isEditOpen}
        userData={editUserData}
        refreshUsers={fetchUsers}
        onCancel={() => setIsEditOpen(false)}
      />
      <UpdateUserFacilityModal
        visible={isUpdateFacilityOpen}
        onCancel={() => setIsUpdateFacilityOpen(false)}
        userId={selectedUserId}
        refreshUsers={fetchUsers}
      />
    </Card>
  );
}

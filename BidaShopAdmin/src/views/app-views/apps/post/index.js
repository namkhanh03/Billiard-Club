import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Image,
  DatePicker,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllPosts, deletePost } from "services/postService"; // Import service cho bài viết
import { debounce } from "lodash";
import CreatePostModal from "./CreatePostModal"; // Modal tạo mới bài viết
import EditPostModal from "./EditPostModal"; // Modal chỉnh sửa bài viết
import moment from "moment"; // Import moment to handle date formatting

export default function PostManagement() {
  const [posts, setPosts] = useState([]); // State lưu trữ danh sách bài viết
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [dateFilter, setDateFilter] = useState(null); // Selected date for filtering
  const [editPostData, setEditPostData] = useState(null); // Dữ liệu chỉnh sửa bài viết
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái modal tạo mới
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái modal chỉnh sửa
  const limit = 10; // Số bài viết trên mỗi trang

  // Hàm lấy bài viết
  const fetchPosts = useCallback(
    async (search = searchTerm, page = currentPage, date = dateFilter) => {
      setLoading(true);
      try {
        const data = await getAllPosts(page, limit, search, date);
        setPosts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy bài viết.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchPosts = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchPosts(value, 1, dateFilter);
    }, 800),
    [fetchPosts, dateFilter]
  );

  // Lấy bài viết khi trang, từ khóa tìm kiếm hoặc ngày thay đổi
  useEffect(() => {
    fetchPosts(searchTerm, currentPage, dateFilter);
  }, [fetchPosts, currentPage, dateFilter]);

  // Hàm xóa bài viết
  const confirmDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      message.success("Đã xóa bài viết.");
      fetchPosts();
    } catch (error) {
      message.error("Lỗi khi xóa bài viết.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditPostData(record);
    setIsEditOpen(true);
  };

  // Hàm xử lý thay đổi ngày
  const handleDateChange = (date, dateString) => {
    setDateFilter(date ? moment(dateString, "DD/MM/YYYY").toDate() : null); // Convert to JavaScript Date
    setCurrentPage(1); // Reset to page 1 when the date changes
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã bài viết",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người Đăng",
      dataIndex: "postedBy",
      key: "postedBy",
      render: (postedBy) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src={postedBy?.avatar || "https://via.placeholder.com/50"}
            alt="Facility"
            width={40}
            height={40}
            style={{ borderRadius: "10%" }}
          />
          {postedBy?.fullName || "Không có dữ liệu"}
        </div>
      ),
    },
    {
      title: "Ngày Đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          src={text || "https://via.placeholder.com/50"}
          alt="Bài viết"
          width={70}
          height={70}
          style={{ borderRadius: "10%" }}
        />
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
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => confirmDeletePost(record.id)}
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
      <div>
        {/* Ô tìm kiếm, nút thêm mới bài viết và bộ lọc ngày */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "20px" }}>
          <Input
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchPosts(e.target.value, 1, dateFilter);
            }}
            style={{ width: "60%" }}
          />
          <DatePicker
            format="DD/MM/YYYY"  // Set the date format to "DD/MM/YYYY"
            onChange={handleDateChange}
            style={{ width: "30%" }}
            placeholder="Chọn ngày"
          />
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Bài Viết
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng bài viết */}
            <Table
              columns={columns}
              dataSource={posts}
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
          </>
        )}
      </div>

      <CreatePostModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshPosts={fetchPosts}
      />

      <EditPostModal
        visible={isEditOpen}
        postData={editPostData}
        refreshPosts={fetchPosts}
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}

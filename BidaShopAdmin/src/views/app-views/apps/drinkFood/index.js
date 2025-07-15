import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Select,
  Tag,
  Image,
  Switch,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllDrinkFoods,
  deleteDrinkFood,
  toggleDrinkFoodActive,
} from "services/drinkFoodService";
import { getAllCategories } from "services/categoryService";
import { getAllFacilities } from "services/facilityService";
import { debounce } from "lodash";
import { formatCurrency } from "utils/formatCurrency";
import CreateFoodDrinkModal from "./CreateFoodDrinkModal";
import EditFoodDrinkModal from "./EditFoodDrinkModal";
import { getFacilityByUser } from "services/facilityUserService";

const { Option } = Select;

export default function DrinkFoodManagement() {
  const [drinkFoods, setDrinkFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [editFoodData, setEditFoodData] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const limit = 10;
  const userData = JSON.parse(localStorage.getItem("user"));
  const fetchDrinkFoods = useCallback(
    async (
      search = searchTerm,
      page = currentPage,
      categoryId = selectedCategory,
      facilityId = selectedFacility
    ) => {
      setLoading(true);
      try {
        const data = await getAllDrinkFoods(page, limit, search, categoryId, facilityId, userData.userId);
        setDrinkFoods(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đồ uống/thức ăn.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, selectedCategory, selectedFacility]
  );

  const fetchCategories = async () => {
    try {
      const categoryData = await getAllCategories();
      setCategories(categoryData.content);
    } catch (error) {
      message.error("Lỗi khi lấy danh mục.");
    }
  };

  const fetchFacilities = async () => {
    try {
      const facilityData = await getFacilityByUser(userData.userId);
      setFacilities(facilityData);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách chi nhánh.");
    }
  };

  const debouncedFetchDrinkFoods = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchDrinkFoods(value, 1);
    }, 800),
    [fetchDrinkFoods]
  );

  useEffect(() => {
    fetchDrinkFoods(searchTerm, currentPage);
  }, [fetchDrinkFoods, currentPage]);

  useEffect(() => {
    fetchCategories();
    fetchFacilities();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    fetchDrinkFoods(searchTerm, 1, value, selectedFacility);
  };

  const handleFacilityChange = (value) => {
    setSelectedFacility(value);
    setCurrentPage(1);
    fetchDrinkFoods(searchTerm, 1, selectedCategory, value);
  };

  const confirmDeleteDrinkFood = async (foodId) => {
    try {
      await deleteDrinkFood(foodId);
      message.success("Đã xóa đồ uống/thức ăn.");
      fetchDrinkFoods();
    } catch (error) {
      message.error("Lỗi khi xóa đồ uống/thức ăn.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditFoodData(record);
    setIsEditOpen(true);
  };

  const handleToggleActive = async (foodId, isActive) => {
    try {
      await toggleDrinkFoodActive(foodId, !isActive);
      message.success(`Đã ${isActive ? "vô hiệu hóa" : "kích hoạt"} đồ uống/thức ăn.`);
      fetchDrinkFoods();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái đồ uống/thức ăn.");
    }
  };

  const columns = [
    {
      title: "Mã món ăn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${formatCurrency(text)}`,
    },
    {
      title: "Danh Mục",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src={category?.image || "https://via.placeholder.com/50"}
            alt="Category"
            width={40}
            height={40}
            style={{ borderRadius: "10%" }}
          />
          {category?.name || "Không có dữ liệu"}
        </div>
      ),
    },
    {
      title: "Chi Nhánh",
      dataIndex: "facility",
      key: "facility",
      render: (facility) => facility?.name || "Không có",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => {
        const isLow = quantity <= record.warningThreshold;
        return (
          <Tag color={isLow ? "red" : "green"}>
            {quantity} {isLow ? "(Sắp hết)" : ""}
          </Tag>
        );
      },
    },
    {
      title: "Mức Cảnh Báo",
      dataIndex: "warningThreshold",
      key: "warningThreshold",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          src={text || "https://via.placeholder.com/50"}
          alt="Ảnh món"
          width={50}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive, record) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${isActive ? "vô hiệu hóa" : "kích hoạt"} món này không?`}
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
            title="Bạn có chắc muốn xóa món này?"
            onConfirm={() => confirmDeleteDrinkFood(record.id)}
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <Input
            placeholder="Tìm kiếm đồ uống/thức ăn theo tên món"
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchDrinkFoods(e.target.value);
            }}
            style={{ width: "35%" }}
          />
          <Select
            placeholder="Chọn Danh Mục"
            onChange={handleCategoryChange}
            style={{ width: "25%" }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
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
            Thêm Mới
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={drinkFoods}
            pagination={false}
            rowKey={(record) => record.id}
          />
        )}

        <Pagination
          current={currentPage}
          total={totalPages * limit}
          pageSize={limit}
          onChange={handlePageChange}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
      <CreateFoodDrinkModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshDrinkFoods={fetchDrinkFoods}
        categories={categories}
      />
      <EditFoodDrinkModal
        visible={isEditOpen}
        foodData={editFoodData}
        refreshDrinkFoods={fetchDrinkFoods}
        onCancel={() => setIsEditOpen(false)}
        categories={categories}
      />
    </Card>
  );
}
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
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllIncomeExpense,
  deleteIncomeExpense,
  getTotalByDate,
} from "services/incomeExpenseService";
import { debounce } from "lodash";
import ReactApexChart from "react-apexcharts"; // Import ApexChart
import { EyeOutlined } from "@ant-design/icons"; // Import the Eye icon for the button
import CreateIncomeExpenseModal from "./CreateIncomeExpenseModal"; // Modal tạo thu chi
import EditIncomeExpenseModal from "./EditIncomeExpenseModal"; // Modal chỉnh sửa thu chi
import { getFacilityByUser } from "services/facilityUserService";
import { formatCurrency } from "utils/formatCurrency";
import moment from "moment";

const { Option } = Select;

export default function IncomeExpenseManagement() {
  const [incomeExpenses, setIncomeExpenses] = useState([]);
  const [facilities, setFacilities] = useState([]); // Danh sách cơ sở
  const [selectedFacility, setSelectedFacility] = useState(null); // Cơ sở được chọn
  const [type, setType] = useState(null); // Loại thu chi (Income/Expense)
  const [date, setDate] = useState(null); // Ngày
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIncomeExpenseData, setEditIncomeExpenseData] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const limit = 10;
  const userData = JSON.parse(localStorage.getItem("user"));

  // ✅ Hàm lấy danh sách thu chi
  const fetchIncomeExpenses = useCallback(
    async (search = searchTerm, page = currentPage, facilityId = selectedFacility) => {
      setLoading(true);
      try {
        const data = await getAllIncomeExpense(
          facilityId,
          type,
          search,
          date,
          page,
          limit,
          userData.userId
        );
        setIncomeExpenses(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách thu chi.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, selectedFacility, type, date, searchTerm]
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
  const debouncedFetchIncomeExpenses = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchIncomeExpenses(value, 1, selectedFacility);
    }, 800),
    [fetchIncomeExpenses, selectedFacility]
  );

  // ✅ Gọi API khi trang, từ khóa tìm kiếm, hoặc cơ sở thay đổi
  useEffect(() => {
    fetchFacilities(); // Lấy danh sách cơ sở ngay từ đầu
    fetchIncomeExpenses(searchTerm, currentPage, selectedFacility);
    fetchTotalByDate()
  }, [fetchIncomeExpenses, fetchFacilities, currentPage, selectedFacility]);
  const fetchTotalByDate = useCallback(async () => {
    try {
      const total = await getTotalByDate(date, date);
      setTotalIncome(total.totalIncome);  // Giả sử API trả về tổng thu và tổng chi
      setTotalExpense(total.totalExpense);
    } catch (error) {
      message.error("Lỗi khi lấy tổng thu chi.");
    }
  }, [date]);
  // ✅ Xóa thu chi
  const confirmDeleteIncomeExpense = async (id) => {
    try {
      await deleteIncomeExpense(id);
      message.success("Đã xóa hóa đơn thu chi.");
      fetchIncomeExpenses();
      fetchTotalByDate();
    } catch (error) {
      message.error("Lỗi khi xóa hóa đơn thu chi.");
    }
  };

  // ✅ Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Mở modal chỉnh sửa thu chi
  const handleEditClick = (record) => {
    setEditIncomeExpenseData(record);
    setIsEditOpen(true);
  };
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Thu nhập', 'Chi phí'],
    colors: ['#28a745', '#dc3545'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const chartSeries = [totalIncome, totalExpense];

  const columns = [
    {
      title: "Mã HĐ thu chi",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Loại thu chi",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Income" ? "green" : "red"}>
          {type === "Expense" ? "Hóa đơn chi" : "Hóa đơn thu"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Cơ sở",
      dataIndex: "facility",
      key: "facility",
      render: (facility) => facility?.name || "Không có dữ liệu",
    },
    {
      title: "Hóa đơn",
      dataIndex: "documentPath",
      key: "documentPath",
      render: (documentPath) => (
        documentPath ? (
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => window.open(documentPath, "_blank")}
          >Xem hóa đơn</Button>
        ) : "Không có hóa đơn"
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" size="small" onClick={() => handleEditClick(record)}>
            Sửa
          </Button>
          {userData.role === "ADMIN" && (
            <Popconfirm
              title="Bạn có chắc muốn xóa thu chi này?"
              onConfirm={() => confirmDeleteIncomeExpense(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button size="small" style={{ marginLeft: "10px" }}>
                Xóa
              </Button>
            </Popconfirm>
          )}

        </div>
      ),
    },

  ];


  return (
    <Card>
      <div style={{ display: "flex", marginBottom: "20px", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px", width: "80%" }}>
          <Select
            style={{ width: "30%" }}
            placeholder="Chọn loại thu chi"
            allowClear
            onChange={(value) => {
              setType(value);
              setCurrentPage(1);
            }}
          >
            <Option value="Income"><Tag color="green">Hóa đơn thu</Tag></Option>
            <Option value="Expense"><Tag color="red">Hóa đơn chi</Tag></Option>
          </Select>
          <DatePicker
            style={{ width: "25%" }}
            placeholder="Chọn ngày"
            value={date || moment()}  // Nếu không có giá trị `date`, sử dụng ngày hiện tại
            onChange={(date) => {
              setDate(date);
              setCurrentPage(1);
            }}
          />

        </div>
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Thêm mới thu chi
        </Button>
      </div>
      <Row gutter={16}>
        {/* Cột biểu đồ (Chart) căn trái */}
        <Col span={16}>
          <Table
            columns={columns}
            dataSource={incomeExpenses}
            pagination={false}
            rowKey={(record) => record.id}
          />

        </Col>

        {/* Cột bảng (Table) căn phải */}
        <Col span={8}>
          <Card title="Biểu đồ tổng thu chi" bordered={false}>
            <ReactApexChart options={chartOptions} series={chartSeries} type="pie" height={250} />
          </Card>
        </Col>
      </Row>



      <Pagination
        current={currentPage}
        total={totalPages * limit}
        pageSize={limit}
        onChange={handlePageChange}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
      <CreateIncomeExpenseModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshIncomeExpenses={fetchIncomeExpenses}
      />
      <EditIncomeExpenseModal
        visible={isEditOpen}
        incomeExpenseData={editIncomeExpenseData}
        refreshIncomeExpenses={fetchIncomeExpenses}
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}

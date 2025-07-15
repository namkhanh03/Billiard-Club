// ✅ Sử dụng react-apexcharts (SVG-based, không dùng canvas)
// ✅ Đã chuyển biểu đồ từ daily sang monthly
import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Button, Card, DatePicker, message, Select } from "antd";
import StatisticWidget from "components/shared-components/StatisticWidget";
import ChartWidget from "components/shared-components/ChartWidget";
import {
  getRevunueSumary,
  getIncomeExpenseSummary,
  getMonthlyRevenueAndExpense,
  getTop10BestSellers,
} from "services/revenueService.js";
import { withRouter } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import moment from "moment";
import { getAllOrders } from "services/orderService";
import Chart from "react-apexcharts";
import { getFacilityByUser } from "services/facilityUserService";

const { Option } = Select;

const TableBilliard = "https://cdn-icons-png.flaticon.com/128/8258/8258881.png";
const User = "https://cdn-icons-png.flaticon.com/128/4577/4577207.png";
const Facility = "https://cdn-icons-png.flaticon.com/128/273/273177.png";

export const DefaultDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [revenue, setRevenue] = useState(null);
  const [incomeExpenseData, setIncomeExpenseData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [top10Data, setTop10Data] = useState(null);

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const [top10Facility, setTop10Facility] = useState(null);
  const [top10Year, setTop10Year] = useState(moment().year());
  const [top10Month, setTop10Month] = useState(moment().month() + 1);

  const [pieOptionsRevenue, setPieOptionsRevenue] = useState({});
  const [pieSeriesRevenue, setPieSeriesRevenue] = useState([]);

  const [pieOptionsIncomeExpense, setPieOptionsIncomeExpense] = useState({});
  const [pieSeriesIncomeExpense, setPieSeriesIncomeExpense] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(1, 5);
      console.log("Orders fetched", data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchFacilities = useCallback(async () => {
    try {
      const data = await getFacilityByUser(userData.userId);
      setFacilities(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách cơ sở.");
    }
  }, [userData.userId]);

  const fetchRevenueSummary = async () => {
    try {
      const revenueData = await getRevunueSumary();
      setRevenue(revenueData);
    } catch (error) {
      console.error("Error fetching revenue summary:", error);
    }
  };

  const handleFetchIncomeExpense = async () => {
    try {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      const data = await getIncomeExpenseSummary(startDate, endDate);
      setIncomeExpenseData(data);

      if (data) {
        const names = ["Thu nhập", "Chi phí"];
        const values = [data.totalIncome || 0, data.totalExpense || 0];

        setPieOptionsIncomeExpense({
          labels: names,
          legend: { position: "bottom" },
          dataLabels: {
            formatter: (val, opts) => `${opts.w.config.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`,
          },
        });

        setPieSeriesIncomeExpense(values);
      }
    } catch (error) {
      console.error("Error fetching income-expense summary:", error);
    }
  };

  const handleFetchMonthlyRevenue = async () => {
    try {
      const data = await getMonthlyRevenueAndExpense(selectedYear, selectedFacility);
      setMonthlyData(data);
    } catch (error) {
      console.error("Error fetching monthly revenue and expense:", error);
    }
  };

  const handleFetchTop10BestSellers = async () => {
    try {
      const data = await getTop10BestSellers(top10Month, top10Year, top10Facility);
      setTop10Data(data);
    } catch (error) {
      console.error("Error fetching top 10 best sellers:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchFacilities();
    fetchRevenueSummary();
    handleFetchMonthlyRevenue();
    handleFetchIncomeExpense();
    handleFetchTop10BestSellers();
  }, []);

  useEffect(() => {
    if (revenue?.facilityRevenue) {
      const facilityRevenueEntries = Object.entries(revenue.facilityRevenue || {});
      const names = facilityRevenueEntries.map(([name]) => name);
      const values = facilityRevenueEntries.map(([_, value]) => value);

      setPieOptionsRevenue({
        labels: names,
        legend: { position: "bottom" },
        dataLabels: {
          formatter: (val, opts) => `${val.toFixed(1)}%`,
        },
      });

      setPieSeriesRevenue(values);
    }
  }, [revenue]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget title="Tổng số chi nhánh" value={`${revenue?.totalFacilities} chi nhánh`} imgSrc={Facility} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget title="Tổng số bàn" value={`${revenue?.totalBilliardTables} bàn`} imgSrc={TableBilliard} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget title="Tổng số khách hàng" value={`${revenue?.totalUsers} khách hàng`} imgSrc={User} />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget
                title="Doanh thu hôm nay"
                value={formatCurrency(revenue?.todayRevenue) ?? formatCurrency(0)}
                status={revenue?.todayIncreasePercentage}
                subtitle={`So với hôm qua (${formatCurrency(revenue?.yesterdayRevenue)})`}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget
                title="Doanh thu tháng này"
                value={formatCurrency(revenue?.monthlyRevenue) ?? formatCurrency(0)}
                status={revenue?.monthlyIncreasePercentage}
                subtitle={`So với tháng trước (${formatCurrency(revenue?.lastMonthRevenue)})`}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <StatisticWidget
                title="Doanh thu năm"
                value={formatCurrency(revenue?.yearlyRevenue) ?? formatCurrency(0)}
                status={revenue?.yearlyIncreasePercentage}
                subtitle={`So với năm ngoái (${formatCurrency(revenue?.lastYearRevenue)})`}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Thống kê hóa đơn thu - chi" style={{ height: "auto" }}>
                <Chart options={pieOptionsIncomeExpense} series={pieSeriesIncomeExpense} type="pie" height={350} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Tỉ lệ doanh thu theo chi nhánh" style={{ height: "auto" }}>
                <Chart options={pieOptionsRevenue} series={pieSeriesRevenue} type="pie" height={350} />
              </Card>
            </Col>
          </Row>

          {/* Bộ lọc doanh thu theo tháng */}
          <Row gutter={16} style={{ marginTop: 24 }} align="middle">
            <Col xs={24} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn cơ sở"
                allowClear
                onChange={(value) => {
                  setSelectedFacility(value);
                  handleFetchMonthlyRevenue();
                }}
              >
                {facilities.map((facility) => (
                  <Option key={facility.id} value={facility.id}>
                    {facility.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <DatePicker
                picker="year"
                value={moment(`${selectedYear}`, "YYYY")}
                format="YYYY"
                allowClear={false}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setSelectedYear(Number(dateString));
                  handleFetchMonthlyRevenue();
                  handleFetchIncomeExpense();
                }}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <ChartWidget
                title="Doanh thu & Chi phí theo tháng"
                series={monthlyData?.series}
                xAxis={monthlyData?.categories}
                height={400}
              />
            </Col>
          </Row>

          {/* Bộ lọc top 10 bán chạy */}
          <Row gutter={16} style={{ marginTop: 24 }} align="middle">
            <Col xs={24} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn cơ sở (Top 10)"
                allowClear
                onChange={(value) => {
                  setTop10Facility(value);
                  handleFetchTop10BestSellers();
                }}
              >
                {facilities.map((facility) => (
                  <Option key={facility.id} value={facility.id}>
                    {facility.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <DatePicker
                picker="year"
                value={moment(`${top10Year}`, "YYYY")}
                format="YYYY"
                allowClear={false}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setTop10Year(Number(dateString));
                  handleFetchTop10BestSellers();
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <DatePicker
                picker="month"
                value={moment().month(top10Month - 1)}
                format="MM"
                allowClear={false}
                style={{ width: "100%" }}
                onChange={(date) => {
                  const newMonth = date?.month() + 1;
                  setTop10Month(newMonth);
                  handleFetchTop10BestSellers();
                }}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="Top 10 món bán chạy nhất theo tháng" style={{ height: "auto" }}>
                <Chart
                  options={{
                    chart: { type: "bar", height: 400 },
                    plotOptions: { bar: { horizontal: true } },
                    xaxis: { categories: top10Data?.categories || [] },
                    dataLabels: { enabled: true },
                  }}
                  series={top10Data?.series || []}
                  type="bar"
                  height={400}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(DefaultDashboard);
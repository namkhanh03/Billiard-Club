import React, { useEffect, useState, useCallback } from "react";
import {
  Input,
  Select,
  Spin,
  message,
  Card,
  Tooltip
} from "antd";
import { getFacilityByUser } from "services/facilityUserService";
import { getAllBilliardTables } from "services/billiardTableService";
import TableReservationModal from "./TableReservationModal";

const { Option } = Select;

export default function BilliardTableList() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [tables, setTables] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);


  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBilliardTables(1, 100, searchTerm, selectedFacility, userData.userId);
      setTables(data.content);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách bàn bi-a.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedFacility]);

  const fetchFacilities = useCallback(async () => {
    try {
      const data = await getFacilityByUser(userData.userId);
      setFacilities(data);
    } catch {
      message.error("Không thể lấy danh sách chi nhánh.");
    }
  }, [userData.userId]);

  useEffect(() => {
    fetchFacilities();
    fetchTables();
  }, [fetchTables, fetchFacilities]);

  const getTableImage = (status) => {
    return status === "Available"
      ? "https://cdn-icons-png.flaticon.com/128/17937/17937526.png"
      : "https://cdn-icons-png.flaticon.com/128/8258/8258881.png";
  };

  const getTableStyle = (status) => ({
    backgroundColor: status === "Available" ? "#fff" : "#ffe3cc",  // cam nhạt
    border: status === "Available" ? "1px solid #ccc" : "2px solid #ff7b1d", // cam đậm
    borderRadius: 12,
    padding: 16,
    textAlign: "center",
    transition: "0.2s",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
  });
  

  return (
    <Card title="Danh sách bàn bi-a">
      <div style={{
        display: "flex",
        marginBottom: "20px",
        gap: "10px"
      }}>
        <Input
          placeholder="Tìm kiếm bàn bi-a..."
          allowClear
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          style={{ width: "40%" }}
        />
        <Select
          style={{ width: "40%" }}
          placeholder="Chọn cơ sở"
          allowClear
          onChange={(value) => {
            setSelectedFacility(value);
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
      </div>


      {loading ? (
        <div className="text-center my-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {Object.entries(
            tables.reduce((acc, table) => {
              const facilityId = table.facility?.id || "unknown";
              if (!acc[facilityId]) acc[facilityId] = [];
              acc[facilityId].push(table);
              return acc;
            }, {})
          ).map(([facilityId, tablesInFacility]) => {
            const facilityName = tablesInFacility[0]?.facility?.name || "Không xác định";

            return (
              <div key={facilityId} style={{ marginBottom: "2rem" }}>
                <h3 style={{ margin: "20px 0 10px", color: "#1a3353" }}>{facilityName}</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "30px",
                  }}
                >
                  {tablesInFacility.map((table) => (
                    <Tooltip title={`Bàn: ${table.name}`} key={table.id}>
                      <div
                        style={getTableStyle(table.status)}
                        onClick={() => setSelectedTable(table)}
                      >
                        <img
                          src={getTableImage(table.status)}
                          alt={table.name}
                          style={{ width: 70, height: 70, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                          {table.name}
                        </div>
                        <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
                          <b>Chi nhánh:</b> {table.facility?.name}
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            );
          })}

        </>
      )}
      <TableReservationModal
        fetchTables={fetchTables}
        open={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        table={selectedTable}
      />

    </Card>
  );
}

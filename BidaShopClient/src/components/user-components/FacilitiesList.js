import React, { useState, useEffect } from "react";
import { WarningOutlined } from "@ant-design/icons";
import styles from "./CourseList.module.css";
import { getAllFacilities } from "../../services/facilityService";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

const FacilitiesList = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading for facilities
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const facilitiesPerPage = 6;
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchQuery, 700);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (debouncedSearch) setSearching(true);
        setLoading(true); // Start loading when fetch starts
        const data = await getAllFacilities(currentPage, facilitiesPerPage, debouncedSearch);
        setFacilities(data.content);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách cơ sở");
        console.error(err);
      } finally {
        setLoading(false); // Stop loading when fetch is done
        setSearching(false);
      }
    };

    fetchFacilities();
  }, [currentPage, debouncedSearch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewDetail = (id) => {
    navigate(`/facilities/${id}`);
  };

  return (
    <div className={styles.containerFull}>
      <div className={styles.coursesListContainer}>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm cơ sở"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.coursesContainer}>
          <h2 className={styles.coursesTitle}>Danh sách cơ sở</h2>

          {searching ? (
            <div className="text-center">Đang tìm kiếm...</div>
          ) : facilities.length === 0 ? (
            <div className="text-center text-danger">Không có chi nhánh nào phù hợp.</div>
          ) : (
            <div className={styles.coursesGrid}>
              {loading ? (
                <div className="text-center">Đang tải dữ liệu...</div> // Show loading only for facilities list
              ) : (
                facilities.map((facility) => (
                  <div key={facility.id} className={styles.courseCard}>
                    <div className={styles.courseContent}>
                      <img
                        className={styles.courseImage}
                        src={facility.images?.[0]?.imageUrl || "/default-image.jpg"}
                        alt={facility.name}
                      />
                      <div className={styles.courseInfo}>
                        <h2 className={styles.courseName}>{facility.name}</h2>
                        <h6>{facility.address}</h6>
                        <h6>SĐT: {facility.phoneNumber}</h6>
                        <button
                          className={styles.detailsBtn}
                          onClick={() => handleViewDetail(facility.id)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <span className={styles.pageInfo}>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className={styles.paginationBtn}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesList;

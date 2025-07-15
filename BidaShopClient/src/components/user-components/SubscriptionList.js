import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./SubscriptionList.module.css";
import { Modal, Tabs } from 'antd';
import PreSubscriptionSurvey from './PreSubscriptionSurvey';
import { WarningOutlined } from '@ant-design/icons';
const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
  const navigate = useNavigate();

  // Tính toán tiến độ hoàn thành và trả về số lượng workout hoàn thành và tổng số workout
  const calculateProgress = (workouts) => {
    const completedWorkouts = workouts.filter(workout => workout.status === 'success').length;
    const totalWorkouts = workouts.length;
    return {
      progress: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      completedWorkouts,
      totalWorkouts,
    };
  };

  // Filter subscriptions theo searchTerm
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(subscription =>
        subscription._id.toLowerCase().includes(value) ||
        subscription.courseId?.name.toLowerCase().includes(value)
      );
      setFilteredSubscriptions(filtered);
    }
  };

  // Sắp xếp subscriptions theo ngày từ mới đến cũ
  const sortSubscriptionsByDate = (subscriptions) => {
    return subscriptions.map(subscription => {
      const sortedWorkouts = [...subscription.workoutId].sort((a, b) => new Date(b.date) - new Date(a.date));
      return { ...subscription, workoutId: sortedWorkouts };
    });
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/subscriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedSubscriptions = sortSubscriptionsByDate(response.data.subscriptions);
        setSubscriptions(sortedSubscriptions);
        setFilteredSubscriptions(sortedSubscriptions);
      } catch (err) {
        setError("Error fetching subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleViewSubscription = (subscriptionId) => {
    navigate(`/userSubscription/${subscriptionId}`);
  };

  const handleViewSchedule = (subscriptionId) => {
    navigate(`/userSchedule/${subscriptionId}`);
  };

  const handleViewSurvey = (subscriptionId) => {
    setCurrentSubscriptionId(subscriptionId);
    setIsSurveyModalOpen(true);
  };

  const handleViewChatRoom = (subscriptionId) => {
    navigate(`/chatRoom/${subscriptionId}`);
  };

  const handlePauseSubscription = async (subscription) => {
    if (subscription.subscriptionStatus.status !== 'active') {
      Modal.warning({
        title: 'Không thể tạm dừng',
        content: 'Bạn không thể tạm dừng khóa học thêm lần nữa',
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận tạm dừng',
      content: 'Bạn có chắc chắn muốn tạm dừng khóa học này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.post(
            `http://localhost:5000/api/users/pauseSubscription/${subscription._id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Cập nhật lại danh sách đăng ký
          const response = await axios.get(
            "http://localhost:5000/api/users/subscriptions",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const sortedSubscriptions = sortSubscriptionsByDate(response.data.subscriptions);
          setSubscriptions(sortedSubscriptions);
          setFilteredSubscriptions(sortedSubscriptions);

          Modal.success({
            content: 'Đã tạm dừng khóa học.',
          });
        } catch (err) {
          Modal.error({
            content: 'Không thể tạm dừng khóa học.',
          });
        }
      },
    });
  };

  const handleUnpauseSubscription = async (subscription) => {
    Modal.confirm({
      title: 'Xác nhận tiếp tục',
      content: 'Bạn có chắc chắn muốn tiếp tục khóa học này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.post(
            `http://localhost:5000/api/users/unpauseSubscription/${subscription._id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Cập nhật lại danh sách đăng ký
          const response = await axios.get(
            "http://localhost:5000/api/users/subscriptions",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const sortedSubscriptions = sortSubscriptionsByDate(response.data.subscriptions);
          setSubscriptions(sortedSubscriptions);
          setFilteredSubscriptions(sortedSubscriptions);

          Modal.success({
            content: 'Đã tiếp tục khóa học.',
          });
        } catch (err) {
          Modal.error({
            content: 'Không thể tiếp tục khóa học.',
          });
        }
      },
    });
  };

  // Hàm lọc subscriptions theo trạng thái
  const filterSubscriptionsByStatus = (status) => {
    const subscriptionsToFilter = searchTerm === "" ? subscriptions : filteredSubscriptions;

    return subscriptionsToFilter.filter(subscription => {
      const { progress } = calculateProgress(subscription.workoutId);

      switch (status) {
        case "active":
          return (subscription.subscriptionStatus.status === "active" ||
            subscription.subscriptionStatus.status === "ongoing") &&
            progress < 100;
        case "pause":
          return subscription.subscriptionStatus.status === "pause";
        case "finish":
          // Kiểm tra progress 100% thay vì trạng thái finish
          return progress === 100;
        default:
          return false;
      }
    });
  };

  // Thêm hàm xử lý status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pause':
        return styles.subscriptionStatusPause;
      case 'finish':
        return styles.subscriptionStatusFinish;
      case 'active':
      case 'ongoing':
        return styles.subscriptionStatusActive;
      default:
        return '';
    }
  };

  // Thêm hàm xử lý status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pause':
        return 'Tạm dừng';
      case 'finish':
        return 'Hoàn thành';
      case 'active':
      case 'ongoing':
        return 'Đang hoạt động';
      default:
        return '';
    }
  };

  // Thêm hàm format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Cấu hình tabs
  const items = [
    {
      key: 'active',
      label: 'Đang diễn ra',
      children: (
        <div className={styles.cardContainer}>
          {filterSubscriptionsByStatus("active").length > 0 ? (
            filterSubscriptionsByStatus("active").map((subscription) => {
              const { progress, completedWorkouts, totalWorkouts } = calculateProgress(subscription.workoutId);
              const subscriptionStatus = subscription.subscriptionStatus.status;
              const hasWorkoutSchedule = subscription.workoutId && subscription.workoutId.length > 0;
              const statusClass = getStatusClass(subscriptionStatus);
              const statusText = getStatusText(subscriptionStatus);
              const startDate = formatDate(subscription.startDate);

              return (
                <div className={`${styles.card} ${statusClass}`} key={subscription._id}>
                  <div className={styles.cardBody}>
                    <h5 className={styles.cardTitle}>
                      {subscription.courseId?.name || "Khóa học không xác định"}
                    </h5>
                    <img src={subscription.courseId?.image} alt="Hình ảnh khóa học" />
                    <div className={styles.status}>{statusText}</div>
                    <div className={styles.startDate}>Ngày bắt đầu: {startDate}</div>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressBarWrapper}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${Math.round(progress)}%` }}
                        />
                        <div className={styles.progressText}>
                          {Math.round(progress)}% ({completedWorkouts}/{totalWorkouts})
                        </div>
                      </div>
                    </div>

                    <div className={styles.coachInfo}>
                      <img
                        src={subscription.courseId?.coachId?.avatar || "default-avatar.png"}
                        alt="Avatar huấn luyện viên"
                        className={styles.coachAvatar}
                      />
                      <div className={styles.coachName}>
                        HLV: {subscription.courseId?.coachId?.name || "Chưa có thông tin"}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <div className={styles.buttonRow}>
                        {!hasWorkoutSchedule ? (
                          // Nếu chưa có lịch tập, hiển thị nút làm khảo sát
                          <button
                            className={`${styles.btn} ${styles.btnSurvey}`}
                            onClick={() => handleViewSurvey(subscription._id)}
                          >
                            Làm khảo sát để nhận lịch tập
                          </button>
                        ) : (
                          // Nếu đã có lịch tập
                          <>
                            {/* Chỉ hiển thị nút xem lịch tập khi không trong trạng thái tạm dừng */}
                            {subscriptionStatus !== 'pause' && (
                              <button
                                className={styles.btn}
                                onClick={() => handleViewSchedule(subscription._id)}
                              >
                                Xem lịch tập
                              </button>
                            )}

                            {/* Hiển thị nút tạm dừng/tiếp tục chỉ khi:
                                - Không phải trạng thái finish hoặc ongoing
                                - Tiến độ chưa đạt 100% */}
                            {subscriptionStatus !== 'finish' &&
                              subscriptionStatus !== 'ongoing' &&
                              progress < 100 && (
                                <button
                                  className={`${styles.btn} ${subscriptionStatus === 'pause' ? styles.btnContinue : styles.btnPause}`}
                                  onClick={() => subscriptionStatus === 'pause'
                                    ? handleUnpauseSubscription(subscription)
                                    : handlePauseSubscription(subscription)
                                  }
                                >
                                  {subscriptionStatus === 'pause' ? 'Tiếp tục khóa học' : 'Tạm dừng khóa học'}
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* {!hasWorkoutSchedule && (
                      <div className={styles.surveyNote}>
                        Vui lòng hoàn thành khảo sát để nhận lịch tập phù hợp với bạn
                      </div>
                    )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noSubscriptionMessage}>
              Không có khóa học nào đang diễn ra
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'pause',
      label: 'Tạm dừng',
      children: (
        <div className={styles.cardContainer}>
          {filterSubscriptionsByStatus("pause").length > 0 ? (
            filterSubscriptionsByStatus("pause").map((subscription) => {
              const { progress, completedWorkouts, totalWorkouts } = calculateProgress(subscription.workoutId);
              const subscriptionStatus = subscription.subscriptionStatus.status;
              const hasWorkoutSchedule = subscription.workoutId && subscription.workoutId.length > 0;
              const statusClass = getStatusClass(subscriptionStatus);
              const statusText = getStatusText(subscriptionStatus);
              return (
                <div className={`${styles.card} ${statusClass}`} key={subscription._id}>
                  <div className={styles.cardBody}>
                    <h5 className={styles.cardTitle}>
                      {subscription.courseId?.name || "Khóa học không xác định"}
                    </h5>
                    <img src={subscription.courseId?.image} alt="Hình ảnh khóa học" />
                    <div className={styles.status}>{statusText}</div>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressBarWrapper}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${Math.round(progress)}%` }}
                        />
                        <div className={styles.progressText}>
                          {Math.round(progress)}% ({completedWorkouts}/{totalWorkouts})
                        </div>
                      </div>
                    </div>

                    <div className={styles.coachInfo}>
                      <img
                        src={subscription.courseId?.coachId?.avatar || "default-avatar.png"}
                        alt="Avatar huấn luyện viên"
                        className={styles.coachAvatar}
                      />
                      <div className={styles.coachName}>
                        HLV: {subscription.courseId?.coachId?.name || "Chưa có thông tin"}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <div className={styles.buttonRow}>
                        {!hasWorkoutSchedule ? (
                          // Nếu chưa có lịch tập, hiển thị nút làm khảo sát
                          <button
                            className={`${styles.btn} ${styles.btnSurvey}`}
                            onClick={() => handleViewSurvey(subscription._id)}
                          >
                            Làm khảo sát để nhận lịch tập
                          </button>
                        ) : (
                          // Nếu đã có lịch tập
                          <>
                            {/* Chỉ hiển thị nút xem lịch tập khi không trong trạng thái tạm dừng */}
                            {subscriptionStatus !== 'pause' && (
                              <button
                                className={styles.btn}
                                onClick={() => handleViewSchedule(subscription._id)}
                              >
                                Xem lịch tập
                              </button>
                            )}

                            {/* Hiển thị nút tạm dừng/tiếp tục chỉ khi:
                                - Không phải trạng thái finish hoặc ongoing
                                - Tiến độ chưa đạt 100% */}
                            {subscriptionStatus !== 'finish' &&
                              subscriptionStatus !== 'ongoing' &&
                              progress < 100 && (
                                <button
                                  className={`${styles.btn} ${subscriptionStatus === 'pause' ? styles.btnContinue : styles.btnPause}`}
                                  onClick={() => subscriptionStatus === 'pause'
                                    ? handleUnpauseSubscription(subscription)
                                    : handlePauseSubscription(subscription)
                                  }
                                >
                                  {subscriptionStatus === 'pause' ? 'Tiếp tục khóa học' : 'Tạm dừng khóa học'}
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* {!hasWorkoutSchedule && (
                      <div className={styles.surveyNote}>
                        Vui lòng hoàn thành khảo sát để nhận lịch tập phù hợp với bạn
                      </div>
                    )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noSubscriptionMessage}>
              Không có khóa học nào đang tạm dừng
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'finish',
      label: 'Đã hoàn thành',
      children: (
        <div className={styles.cardContainer}>
          {filterSubscriptionsByStatus("finish").length > 0 ? (
            filterSubscriptionsByStatus("finish").map((subscription) => {
              const { progress, completedWorkouts, totalWorkouts } = calculateProgress(subscription.workoutId);
              const subscriptionStatus = subscription.subscriptionStatus.status;
              const hasWorkoutSchedule = subscription.workoutId && subscription.workoutId.length > 0;
              const statusClass = getStatusClass(subscriptionStatus);
              const statusText = getStatusText(subscriptionStatus);
              return (
                <div className={`${styles.card} ${statusClass}`} key={subscription._id}>
                  <div className={styles.cardBody}>
                    <h5 className={styles.cardTitle}>
                      {subscription.courseId?.name || "Khóa học không xác định"}
                    </h5>
                    <img src={subscription.courseId?.image} alt="Hình ảnh khóa học" />
                    <div className={styles.status}>{statusText}</div>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressBarWrapper}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${Math.round(progress)}%` }}
                        />
                        <div className={styles.progressText}>
                          {Math.round(progress)}% ({completedWorkouts}/{totalWorkouts})
                        </div>
                      </div>
                    </div>

                    <div className={styles.coachInfo}>
                      <img
                        src={subscription.courseId?.coachId?.avatar || "default-avatar.png"}
                        alt="Avatar huấn luyện viên"
                        className={styles.coachAvatar}
                      />
                      <div className={styles.coachName}>
                        HLV: {subscription.courseId?.coachId?.name || "Chưa có thông tin"}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <div className={styles.buttonRow}>
                        {!hasWorkoutSchedule ? (
                          // Nếu chưa có lịch tập, hiển thị nút làm khảo sát
                          <button
                            className={`${styles.btn} ${styles.btnSurvey}`}
                            onClick={() => handleViewSurvey(subscription._id)}
                          >
                            Làm khảo sát để nhận lịch tập
                          </button>
                        ) : (
                          // Nếu đã có lịch tập
                          <>
                            {/* Chỉ hiển thị nút xem lịch tập khi không trong trạng thái tạm dừng */}
                            {subscriptionStatus !== 'pause' && (
                              <button
                                className={styles.btn}
                                onClick={() => handleViewSchedule(subscription._id)}
                              >
                                Xem lịch tập
                              </button>
                            )}

                            {/* Hiển thị nút tạm dừng/tiếp tục chỉ khi:
                                - Không phải trạng thái finish hoặc ongoing
                                - Tiến độ chưa đạt 100% */}
                            {subscriptionStatus !== 'finish' &&
                              subscriptionStatus !== 'ongoing' &&
                              progress < 100 && (
                                <button
                                  className={`${styles.btn} ${subscriptionStatus === 'pause' ? styles.btnContinue : styles.btnPause}`}
                                  onClick={() => subscriptionStatus === 'pause'
                                    ? handleUnpauseSubscription(subscription)
                                    : handlePauseSubscription(subscription)
                                  }
                                >
                                  {subscriptionStatus === 'pause' ? 'Tiếp tục khóa học' : 'Tạm dừng khóa học'}
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* {!hasWorkoutSchedule && (
                      <div className={styles.surveyNote}>
                        Vui lòng hoàn thành khảo sát để nhận lịch tập phù hợp với bạn
                      </div>
                    )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noSubscriptionMessage}>
              Không có khóa học nào đã hoàn thành
            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );
  if (error) return (
    <div className={styles.errorContainer}>
      <WarningOutlined className={styles.errorIcon} />
      <p className={styles.errorMessage}>Không thể hiển thị danh sách khóa học</p>
      <p className={styles.errorDetail}>
        Vui lòng kiểm tra kết nối mạng và thử lại
        <br />
        Nếu vẫn gặp vấn đề, hãy liên hệ với chúng tôi để được hỗ trợ
      </p>
    </div>
  );

  return (
    <div className={styles.containerFluid}>
      <div className={styles.subscriptionList}>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Tìm kiếm theo mã đăng ký hoặc tên khóa học"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {subscriptions.length > 0 ? (
          <Tabs
            defaultActiveKey="active"
            items={items}
            onChange={(key) => setActiveTab(key)}
            className={styles.tabs}
          />
        ) : (
          <p>Không tìm thấy đăng ký nào.</p>
        )}

        {currentSubscriptionId && (
          <PreSubscriptionSurvey
            isOpen={isSurveyModalOpen}
            onRequestClose={() => setIsSurveyModalOpen(false)}
            subscriptionId={currentSubscriptionId}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionList;

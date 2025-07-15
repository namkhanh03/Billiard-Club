import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from './SignContract.module.css'; // Sử dụng CSS module

const SignContract = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/coaches/coachList/${id}`);
                setProfile(response.data);
                setStatus(response.data?.contract?.status || "");
            } catch (err) {
                setError(err.response?.data?.message || "Lấy thông tin hồ sơ thất bại.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "N/A";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleSignContract = async () => {
        try {
            const url = `http://localhost:5000/api/users/contract/${id}`;

            await axios.put(
                url,
                { status: "Signed" },
            );

            toast.success("Hợp đồng đã được ký thành công.");
            setStatus("Signed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể ký hợp đồng.");
            console.error("Lỗi khi ký hợp đồng:", err);
        }
    };

    if (loading) return <p>Đang tải chi tiết hợp đồng...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    if (!profile || !profile.contract) {
        return (
            <div className={styles.contractPage}>
                <h1>Không có dữ liệu hợp đồng. Vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp.</h1>
            </div>
        );
    }

    const { contract } = profile;

    return (
        <div className={styles.contractContainer}>
            <div className={styles.contractHeader}>
                <h1>Hợp đồng dịch vụ gym chuyên nghiệp</h1>
            </div>
            <div className={styles.contractContent}>
                <p>
                    Hợp đồng này được ký kết giữa <strong>{profile.accountId.name}</strong> ("Huấn luyện viên") và công ty.
                </p>

                <div className={styles.contractSection}>
                    <h2>1. Thời hạn hợp đồng</h2>
                    <p>
                        Huấn luyện viên đồng ý cung cấp dịch vụ cho công ty bắt đầu từ <strong>{formatDate(contract.startDate)}</strong> và kết thúc vào <strong>{formatDate(contract.endDate)}</strong>.
                    </p>
                </div>

                <div className={styles.contractSection}>
                    <h2>2. Doanh thu</h2>
                    <p>
                        Huấn luyện viên sẽ nhận được <strong>{contract.percentage}%</strong> doanh thu từ các dịch vụ được cung cấp trong suốt thời gian hiệu lực của hợp đồng này.
                    </p>
                </div>

                <div className={styles.contractSection}>
                    <h2>3. Nghĩa vụ của huấn luyện viên</h2>
                    <p>
                        Huấn luyện viên đồng ý thực hiện nghĩa vụ của mình một cách chuyên nghiệp và theo các chính sách của công ty.
                    </p>
                </div>

                <div className={styles.contractSection}>
                    <h2>4. Bảo mật</h2>
                    <p>
                        Huấn luyện viên đồng ý bảo mật tất cả thông tin độc quyền.
                    </p>
                </div>

                <div className={styles.contractSection}>
                    <h2>Trạng thái</h2>
                    <p><strong>{status || "Chưa ký"}</strong></p>
                </div>

                {status !== "Signed" && status !== "Expired" && (
                    <button className={styles.signButton} onClick={handleSignContract}>
                        Ký Hợp đồng
                    </button>
                )}
            </div>
        </div>
    );
};

export default SignContract;
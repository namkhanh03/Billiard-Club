import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // ✅ Lấy token từ query param

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError("");

    const checks = {
      length: value.length >= 6,
    };

    const missing = [];
    if (!checks.length) missing.push("6 ký tự");

    if (missing.length > 0) {
      setPasswordError(`Mật khẩu cần thêm: ${missing.join(", ")}`);
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password ? "Mật khẩu xác nhận không khớp" : "");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (passwordError || confirmPasswordError) {
      toast.error("Vui lòng kiểm tra lại mật khẩu");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success("Cập nhật mật khẩu thành công. Đang chuyển hướng...");
      setTimeout(() => navigate("/signin"), 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response?.status === 401) {
        toast.error("Liên kết đã hết hạn. Đang chuyển hướng...");
        setTimeout(() => navigate("/forgotpassword"), 3000);
      } else {
        setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.containerSignin}>
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form className={styles.resetPasswordForm} onSubmit={handleSubmit}>
                <h3 className={`${styles.titleSingin} fw-normal mb-3`}>Đặt Lại Mật Khẩu</h3>
                <div className={`${styles.crossbar} mb-3`}></div>
                <div className={styles.loginMessage}>
                  <p className={styles.welcomeText}>Vui lòng nhập mật khẩu mới của bạn.</p>
                </div>

                {message && (
                  <div className={`alert alert-info ${styles.alertMessage}`}>
                    {message}
                  </div>
                )}

                <div className={`${styles.formOutline} mb-4`}>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`${styles.formControlLg} form-control`}
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                  {passwordError && (
                    <div className="text-danger mt-2">
                      <small>{passwordError}</small>
                    </div>
                  )}
                </div>

                <div className={`${styles.formOutline} mb-4`}>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`${styles.formControlLg} form-control`}
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                  {confirmPasswordError && (
                    <div className="text-danger mt-2">
                      <small>{confirmPasswordError}</small>
                    </div>
                  )}
                </div>

                <div className={`${styles.pt1} ${styles.mb4}`}>
                  <button
                    type="submit"
                    className={styles.gradientButton}
                    disabled={
                      loading || passwordError || confirmPasswordError || !password || !confirmPassword
                    }
                  >
                    <span className={styles.buttonIcon}>➜</span>
                    {loading ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT"}
                  </button>
                </div>

                <p>
                  <Link to="/signin" className={styles.linkInfo}>
                    Quay lại trang đăng nhập
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default ResetPassword;

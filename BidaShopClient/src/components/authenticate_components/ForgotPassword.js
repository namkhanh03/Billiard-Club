import { Link } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ForgotPassword.module.css";
import { forgotPassword } from "../../services/authService"; // dùng API từ service

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setMessage("Vui lòng kiểm tra email của bạn để tiếp tục.");
      toast.success("Đã gửi email thành công!");
    } catch (err) {
      console.error("Forgot password error", err);
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.containerSignin}>
      <div className={styles.containerFluid}>
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form
                className={styles.forgotPasswordComponent}
                onSubmit={handleSubmit}
              >
                <h3 className={`${styles.titleSingin} mb-3`}>Quên Mật Khẩu</h3>
                <div className={`${styles.crossbar} mb-3`}></div>
                <div className={styles.loginMessage}>
                  <p className={styles.welcomeText}>
                    Vui lòng nhập email của bạn để nhận hướng dẫn đặt lại{" "}
                    <span style={{ color: "#E48002" }}>mật khẩu</span>.
                  </p>
                </div>

                {message && <div className="alert alert-info">{message}</div>}

                <div className={`${styles.formOutline} mb-4`}>
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    autoComplete="off"
                    className={`form-control form-control-lg ${!isEmailValid && email ? styles.isInvalid : ""}`}
                    onChange={handleEmailChange}
                    value={email}
                    required
                  />
                  {!isEmailValid && email && (
                    <div className={`${styles.textDanger} mt-2`}>
                      <small>Vui lòng nhập địa chỉ email hợp lệ</small>
                    </div>
                  )}
                </div>

                <div className={`${styles.pt1} mb-4`}>
                  <button
                    className={styles.gradientButton}
                    type="submit"
                    disabled={loading || !isEmailValid}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>{" "}
                        <span style={{ marginLeft: "8px" }}>ĐANG GỬI...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>{" "}
                        <span style={{ marginLeft: "8px" }}>GỬI</span>
                      </>
                    )}
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

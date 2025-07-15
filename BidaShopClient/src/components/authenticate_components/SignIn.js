import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SignIn.module.css";
import { login } from "../../services/authService";

export default function SignIn() {
  const [username, setUsername] = useState(""); // dùng username thay vì email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (data) => {
    const { username, password } = data;
    setLoginLoading(true);
    try {
      const result = await login(username, password);
      const { jwtToken } = result.payload[0];
      const user = result.payload[1];

      // Kiểm tra role không hợp lệ để đăng nhập
      const disallowedRoles = ["STAFF", "MANAGER", "ADMIN"];
      if (disallowedRoles.includes(user.role)) {
        toast.warning("Bạn cần tạo tài khoản khách hàng để đăng nhập.");
        setLoginLoading(false);
        return;
      }

      // Kiểm tra tài khoản bị khóa
      if (user.isDelete) {
        toast.warning("Tài khoản của bạn đã bị khóa!");
        setLoginLoading(false);
        return;
      }

      // Lưu thông tin nếu mọi thứ hợp lệ
      localStorage.setItem("auth_token", jwtToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.userId);

      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoginLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin({ username, password });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <section className={styles.containerSignin}>
      <div className="container-fluid">
        <div className="row ">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form
                style={{ width: "30rem" }}
                onSubmit={handleSubmit}
                className={styles.signinComponent}
              >
                <h3 className="fw-normal mb-3 title-singin" style={{ color: "aliceblue" }}>
                  Đăng Nhập
                </h3>
                <div className={styles.crossbar + " mb-3"}></div>
                <div className={styles.loginMessage}>
                  <p className={styles.welcomeText}>
                    Chào mừng trở lại! Đăng nhập để truy cập{" "}
                    <span style={{ color: "#e9600e" }}>BidaClub</span>.
                  </p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-outline mb-4 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span
                    className="position-absolute"
                    onClick={togglePasswordVisibility}
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                </div>

                <div className="pt-1 mb-4">
                  <button
                    type="submit"
                    className={styles.gradientButton}
                    disabled={loginLoading}
                  >
                    <span className={styles.buttonIcon}>➜</span>{" "}
                    {loginLoading ? "Đang đăng nhập..." : "TIẾP TỤC"}
                  </button>
                </div>

                <div className={styles.divider}>
                  <span>HOẶC</span>
                </div>

                {/* Google Login nếu muốn kích hoạt */}
                {/* <GoogleLogin onSuccess={onSuccess} onError={onFailure} /> */}

                <p className={styles.forgotPassword}>
                  Bạn đã{" "}
                  <Link to="/forgotpassword" className={styles.link}>
                    quên mật khẩu?
                  </Link>
                </p>
                <p>
                  <span style={{ fontSize: "small", color: "#fff" }}>
                    Chưa có tài khoản?
                  </span>
                  <Link to="/signup" className={styles.linkInfo}>
                    Đăng ký ngay
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

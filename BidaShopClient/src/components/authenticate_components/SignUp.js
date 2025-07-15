import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SignIn.module.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    const userInfo = {
      username: form.username,
      password: form.password,
      email: form.email,
      phoneNumber: form.phoneNumber,
      role: "CUSTOMER",
      address: null,
      fullName: form.fullName,
    };

    try {
      setSignupLoading(true);
      await signup(userInfo);
      toast.success("Đăng ký thành công!");
      navigate("/signin");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <section className={styles.containerSignin}>
      <div className="container-fluid">
        <div className="row">
          <div className="d-flex justify-content-center align-items-center">
            <form
              style={{ width: "30rem" }}
              className={styles.signinComponent}
              onSubmit={handleSubmit}
            >
              <h3 className="fw-normal mb-3 title-singin" style={{ color: "aliceblue" }}>
                Đăng ký tài khoản
              </h3>
              <div className={styles.crossbar + " mb-3"}></div>

              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                className="form-control form-control-lg mb-3"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                className="form-control form-control-lg mb-3"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control form-control-lg mb-3"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Số điện thoại"
                className="form-control form-control-lg mb-3"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
              <div className="form-outline mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  className="form-control form-control-lg"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="position-absolute"
                  onClick={togglePassword}
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

              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                className="form-control form-control-lg mb-4"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className={styles.gradientButton}
                disabled={signupLoading}
              >
                {signupLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
              </button>

              <p className="mt-3" style={{ color: "#fff" }}>
                Đã có tài khoản?{" "}
                <Link to="/signin" className={styles.linkInfo}>
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

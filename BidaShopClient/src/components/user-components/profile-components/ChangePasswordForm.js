import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import styles from "./UserProfile.module.css";
import { changePassword } from "../../../services/userService";

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Mật khẩu cũ là bắt buộc"),
  newPassword: Yup.string()
    .required("Mật khẩu mới là bắt buộc")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

const ChangePasswordForm = ({ userId }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      await changePassword(userId, values.currentPassword, values.newPassword);
      toast.success("Đổi mật khẩu thành công!");
      resetForm();
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.card}`}>
      <div className={styles.cardBody}>
        <h5>Đổi Mật Khẩu</h5>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div className={styles.formGroup}>
                <label>Mật khẩu hiện tại</label>
                <div className="position-relative">
                  <Field
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    className={`${styles.formControl}`}
                    required
                  />
                  <span
                    className={styles.passwordToggle}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <i
                      className={`fas ${
                        showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
                <ErrorMessage
                  name="currentPassword"
                  component="small"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className="position-relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    className={styles.formControl}
                    required
                  />
                  <span
                    className={styles.passwordToggle}
                    onClick={toggleNewPasswordVisibility}
                  >
                    <i
                      className={`fas ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="small"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu mới</label>
                <div className="position-relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={styles.formControl}
                    required
                  />
                  <span
                    className={styles.passwordToggle}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <i
                      className={`fas ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="small"
                  className={styles.errorMessage}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

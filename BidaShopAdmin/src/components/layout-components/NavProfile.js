import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Avatar, Modal, Input, Button, message } from "antd";
import {
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Icon from "components/util-components/Icon";
import { useHistory } from "react-router-dom";
import { changePassword } from "services/userService";

const menuItem = [
  {
    title: "Đổi mật khẩu",
    icon: EditOutlined,
    key: "change-password",
  },
];

export const NavProfile = () => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const history = useHistory();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const signOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    history.push("/auth/login");
  };

  const handleMenuClick = (key) => {
    if (key === "change-password") {
      setIsModalVisible(true);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return message.warning("Vui lòng nhập đầy đủ thông tin.");
    }

    if (newPassword !== confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp.");
    }

    try {
      await changePassword(user?.userId, currentPassword, newPassword);
      message.success("Đổi mật khẩu thành công!");
      setIsModalVisible(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      message.error(errorMsg);
    }
  };

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={user?.avatar} />
          <div className="pl-3">
            <h4 className="mb-0">{user?.fullName}</h4>
            <span className="text-muted">{user?.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu onClick={(e) => handleMenuClick(e.key)}>
          {menuItem.map((el) => (
            <Menu.Item key={el.key}>
              <Icon className="mr-3" type={el.icon} />
              <span>{el.title}</span>
            </Menu.Item>
          ))}
          <Menu.Item onClick={signOut}>
            <LogoutOutlined className="mr-3" />
            <span>Đăng xuất</span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );

  return (
    <>
      <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
        <div className="flex items-center cursor-pointer px-3 gap-3">
          <Avatar size={40} src={user?.avatar} />
        </div>
      </Dropdown>



      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleChangePassword}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.Password
          placeholder="Mật khẩu hiện tại"
          style={{ marginBottom: 10 }}
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />
        <Input.Password
          placeholder="Mật khẩu mới"
          style={{ marginBottom: 10 }}
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <Input.Password
          placeholder="Xác nhận mật khẩu mới"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />
      </Modal>
    </>
  );
};

export default NavProfile;

import React from "react";
import { Route, Redirect } from "react-router-dom";

// Lấy thông tin user từ localStorage
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      user && allowedRoles.includes(user.role) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/auth/login" /> // Điều hướng đến trang 403 nếu không có quyền
      )
    }
  />
);

export default PrivateRoute;

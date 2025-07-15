import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";

const NavLanguage = () => {
  const [user, setUser] = useState({ fullName: "", role: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex items-center space-x-2 px-2">
      {/* Cột chứa tên và vai trò */}
      <div className="flex flex-col justify-center text-left leading-tight">
        <span className="font-semibold text-[15px] text-black">{user?.fullName} - </span>
        <span className="text-[13px] text-gray-600 font-medium">{user?.role}</span>
      </div>
    </div>
  );
};

export default NavLanguage;

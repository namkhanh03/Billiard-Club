import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, getUserById } from "../../services/userService";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faCalendarAlt, faBriefcase, faSignOutAlt, faKey, faHistory } from "@fortawesome/free-solid-svg-icons";
// import logo from "../img/logomoi.jpg";
import logo from "../img/fitzoneLogofix.png";
import "./Navbar.css";

function Navbar(props) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const moreRef = useRef(null);
  const userRef = useRef(null);
  const [isOutside, setIsOutside] = useState(false);
  const isSignPage = props.title === "Sign In" || props.title === "Sign Up";
  const isSignInOnly = props.title === "Sign In" && props.title !== "Sign Up";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserById(userId)
        .then((data) => {
          setUserName(data.fullName);
          setIsLoggedIn(true);
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }

    const handleScroll = () => {
      console.log("Scroll position:", window.scrollY); // Xem giá trị cuộn
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (userRef.current) {
      const rect = userRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        setIsOutside(true); // Popup vượt mép phải
      } else {
        setIsOutside(false); // Popup nằm trong màn hình
      }
    }
  }, [isUserMenuOpen]);

  useEffect(() => {
    const currentPath = location.pathname.slice(1);
    setActiveMenu(currentPath);
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMoreOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/signin");
    setIsLoggedIn(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setIsMoreOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // console.log(props.title);
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 bg-[#151515] shadow-lg
        ${isScrolled
          ? "bg-[#151515] shadow-lg"
          : `${props.title !== "Sign In" && props.title !== "Sign Up"
            ? "bg-[#151515] md:bg-transparent"
            : ""
          }`
        }
        ${props.title === "Sign In" ? "bg-[#151515] shadow-lg" : ""}
        ${props.title === "Sign Up" ? "bg-[#151515] shadow-lg" : ""}
      `}

      style={{
        backgroundColor: "rgb(21 21 21 / 81%)",
        boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container-cus">
        <div className="flex items-center justify-between px-6 mx-auto">
          {/* Logo */}
          <Link to="/" onClick={() => setActiveMenu("")}>
            <img
              src={logo}
              alt="Logo"
              className="block object-cover w-[150%] h-12 md:h-8"
              style={{ height: "60px" }}
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <div
            className="z-20 text-3xl text-white cursor-pointer md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "✖" : "☰"}
          </div>

          {/* Overlay for mobile */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
              onClick={toggleMenu}
            ></div>
          )}

          {/* Navigation */}
          <nav
            className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 fixed md:relative top-0 left-0 md:flex md:items-center w-3/4 md:w-auto h-full md:h-auto bg-gray-800 md:bg-transparent transition-transform duration-300 ease-in-out z-20`}
          >
            <ul className="flex flex-col items-start gap-6 p-6 text-lg md:flex-row md:items-center md:gap-10 md:p-0 font-oswald no-underline">
              {/* Main Menu Items */}
              {[
                "Trang chủ",
                "Chi nhánh",
                "Liên hệ",
                "Blog",
              ].map((menu) => {
                const path =
                  menu === "Trang chủ"
                    ? ""
                    : menu === "Chi nhánh"
                      ? "list-facility"
                      : menu === "Liên hệ"
                        ? "contact"
                        : menu === "Blog"
                          ? "blog"
                          : menu;

                const isActive = activeMenu === menu || activeMenu === path;

                return (
                  <Link
                    key={menu}
                    to={`/${path}`}
                    className={`transition-colors duration-300 hover:!text-[#F36100] ${isActive
                      ? "text-[#F36100] border-b-2 border-[#F36100]"
                      : "text-white"
                      } `}
                    style={{ textDecoration: "none", paddingTop: "15px" }}
                    onClick={() => handleMenuClick(menu)}
                  >
                    {menu.charAt(0).toUpperCase() + menu.slice(1)}
                  </Link>
                );
              })}

              {!isLoggedIn ? (
                <Link
                  to={{
                    pathname: "/signin",
                    state: { from: window.location.pathname }, // Truyền trạng thái từ trang hiện tại
                  }}
                  className="fixed bottom-0 left-0 w-full px-4 py-3 text-center text-white bg-orange-600 hover:bg-orange-400 rounded-none md:hidden"
                  onClick={() => {
                    setIsMenuOpen(false);
                    localStorage.setItem(
                      "previousPage",
                      window.location.pathname
                    ); // Lưu trang hiện tại vào localStorage
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Đăng nhập
                </Link>
              ) : (
                <div className="relative block md:hidden" ref={userRef}>
                  <div
                    className="fixed bottom-0 left-0 w-full bg-orange-600 text-white flex flex-col items-center md:hidden"
                    onClick={toggleUserMenu}
                  >
                    {/* Nút User */}
                    <button className="text-white font-bold text-lg py-3 w-full">
                      {userName || "User"}
                    </button>

                    {/* Popup */}
                    {isUserMenuOpen && (
                      <div className="absolute bottom-full left-0 w-full bg-[#0f172a] text-white shadow-lg shadow-[#00000080]">
                        <Link
                          to="/userProfile"
                          className="block px-4 py-3 hover:bg-[#F36100] hover:text-gray-900 transition duration-300 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          Thông tin cá nhân
                        </Link>
                        <Link
                          to="/change-password"
                          className="block px-4 py-3 hover:bg-[#F36100] hover:text-gray-900 transition duration-300 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <FontAwesomeIcon icon={faKey} className="mr-2" />
                          Đổi mật khẩu
                        </Link>

                        <Link
                          to="/history"  // Đường dẫn cho lịch sử chơi
                          className="block px-4 py-3 hover:bg-[#F36100] hover:text-gray-900 transition duration-300 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <FontAwesomeIcon icon={faHistory} className="mr-2" />  {/* Sử dụng biểu tượng lịch sử */}
                          Lịch sử chơi
                        </Link>

                        <Link
                          to="/signin"
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full px-4 py-3 text-left hover:bg-[#F36100] hover:text-gray-900 transition duration-300 flex items-center"
                          style={{ textDecoration: "none" }}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                          Đăng xuất
                        </Link>
                      </div>

                    )}
                  </div>
                </div>
              )}
              {/* Login or User Mobile Menu End */}
            </ul>
          </nav>

          {/* User/Login Button */}
          <div className="items-center hidden gap-4 md:flex">

            {!isLoggedIn ? (
              <Link
                to={{
                  pathname: "/signin",
                  state: { from: window.location.pathname }, // Truyền trạng thái từ trang hiện tại
                }}
                className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-400 skew-x-[-10deg] transform"
                onClick={() => {
                  localStorage.setItem(
                    "previousPage",
                    window.location.pathname
                  ); // Lưu trang hiện tại vào localStorage
                }}
                style={{ textDecoration: "none" }}
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={toggleUserMenu}
                  className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-400"
                >
                  {userName || "User"}
                </button>
                {isUserMenuOpen && (
                  <div
                    className={`absolute z-20 w-[14rem] py-2 mt-2 bg-gray-900 rounded-lg shadow-2xl ${isOutside ? "left-0" : "right-0"
                      }`}
                  >
                    <Link
                      to="/userProfile"
                      className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon icon={faKey} className="mr-2" />
                      Đổi mật khẩu
                    </Link>
                    <Link
                      to="/history"  // Đường dẫn cho lịch sử chơi
                      className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />  {/* Sử dụng biểu tượng lịch sử */}
                      Lịch sử chơi
                    </Link>
                    <Link
                      to='/signin'
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      style={{ textDecoration: "none" }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Đăng xuất
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

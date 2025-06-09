import { Link, useLocation } from "react-router-dom";
import {
  FaCalculator, FaSearch, FaBell, FaCog, FaQuestionCircle,
  FaUser, FaSignOutAlt, FaWrench
} from "react-icons/fa";
import "./adminmenu.css";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function AdminMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.replace("/login");
    }
    window.onpageshow = (event) => {
      if (event.persisted) window.location.reload();
    };
  }, []);

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`;
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.replace("/");
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const newTimeout = setTimeout(() => {
      if (value) window.find(value, false, false, true, false, false);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm) {
      window.find(searchTerm, false, false, true, false, false);
    }
  };
  return (
    <div className="menu-container">
      <div className="header">
      <h1 className="header-title" style={{ marginBottom: "23px", fontSize: "28px"}}>
        <div className="header">
          <img src="/geometry.png" className="header-icon-math" alt="Calculator" />
          <span className="header-text black">Toán </span>
          <span className="header-text black">Học </span>
          <span className="header-text blue">Phổ </span>
          <span className="header-text blue">Thông </span>
        </div>
      </h1>
      </div>
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <FaSearch className="search-icon" title="Tìm kiếm" />
        </div>
      </div>

      <div className="icons-and-profile">
        <div className="icons-container">
          <FaBell className="header-icon" />
          <FaQuestionCircle className="header-icon" />
          <FaCog className="header-icon" />
        </div>

        <div
          className="profile-dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="profile-info">
            <span className="profile-email">{user?.full_name || "Người dùng"}</span>
            {getAvatarUrl() ? (
              <img src={getAvatarUrl()} alt="Avatar" className="profile-avatar" />
            ) : (
              <FaCalculator className="profile-icon" />
            )}
          </div>

          {isDropdownOpen && (
            <ul className="submenu-profile">
              <li>
                <Link to="/adminprofile/forum">
                  <FaUser className="submenu-icon" /> Hồ sơ
                </Link>
              </li>
              <li>
                <Link to="/account">
                  <FaWrench className="submenu-icon" /> Tài khoản
                </Link>
              </li>
              <li onClick={handleLogout} className="logout hover-effect">
                <FaSignOutAlt className="submenu-icon" /> Đăng xuất
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* ======== NAVIGATION MENU ======== */}
      <ul
        className="nav"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // căn giữa theo chiều dọc nếu cần
          gap: "60px", // khoảng cách giữa các tab
          listStyle: "none",
          padding: "20px 0", // tăng khoảng cách trên dưới
          marginTop: "30px",
          height: "18px", // độ cao của menu
          backgroundColor: "#f5f5f5", // tùy chọn: nền nhẹ để nhìn rõ chiều cao
          borderRadius: "6px", // tùy chọn: bo góc đẹp hơn
        }}
      >
        <li
          className={location.pathname === "/adminmanage" ? "active" : ""}
          style={{ fontWeight: "bold" }}
        >
          <Link to="/adminmanage" style={{ textDecoration: "none", color: "black" }}>
            QUẢN LÝ TÀI KHOẢN
          </Link>
        </li>
        <li
          className={location.pathname === "/adminmanagedetail" ? "active" : ""}
          style={{ fontWeight: "bold" }}
        >
          <Link to="/adminmanagedetail" style={{ textDecoration: "none", color: "black" }}>
            QUẢN LÝ CHI TIẾT
          </Link>
        </li>
        <li
          className={location.pathname === "/admincourses/listcourses" ? "active" : ""}
          style={{ fontWeight: "bold" }}
        >
          <Link to="/admincourses/listcourses" style={{ textDecoration: "none", color: "black" }}>
            QUẢN LÝ KHÓA HỌC
          </Link>
        </li>
        <li
          className={location.pathname.startsWith("/adminforum") ? "active" : ""}
          style={{ fontWeight: "bold" }}
        >
          <Link to="/adminforum" style={{ textDecoration: "none", color: "black" }}>
            QUẢN LÝ DIỄN ĐÀN
          </Link>
        </li>
        <li
          className={location.pathname === "/adminresult" ? "active" : ""}
          style={{ fontWeight: "bold" }}
        >
          <Link to="/adminresult" style={{ textDecoration: "none", color: "black" }}>
            BÁO CÁO THỐNG KÊ
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminMenu;

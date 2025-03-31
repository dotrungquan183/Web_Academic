import { Link, useLocation } from "react-router-dom";
import {
  FaCalculator, FaSearch, FaBell, FaCog, FaQuestionCircle,
  FaUser, FaSignOutAlt, FaWrench, FaChalkboardTeacher, FaBook, FaHome
} from "react-icons/fa";
import "./studentmenu.css";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function StudentMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

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

  return (
    <div className="menu-container">
      <div className="header">
        <h1 className="header-title">
          <FaCalculator className="header-icon" />
          <span className="header-text black">TOÁN </span>
          <span className="header-text black">HỌC </span>
          <span className="header-text blue">SINH </span>
          <span className="header-text blue">VIÊN </span>
        </h1>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
          <FaSearch className="search-icon" />
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
                <Link to="/profile">
                  <FaUser className="submenu-icon" /> Hồ sơ
                </Link>
              </li>
              <li>
                <Link to="/settings">
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
      <ul className="nav">
        <li className="menu-item-container">
        <Link to="/student" className="menu-item no-underline">
          TRANG CHỦ ▾
        </Link>

          <ul className="submenu">
            <li className={location.pathname === "/studenthome1" ? "active" : ""}>
              <Link to="/studenthome1">
                <FaHome className="submenu-icon" /> Home1
              </Link>
            </li>
            <li className={location.pathname === "/studenthome2" ? "active" : ""}>
              <Link to="/studenthome2">
                <FaBook className="submenu-icon" /> Home2
              </Link>
            </li>
            <li className={location.pathname === "/studenthome3" ? "active" : ""}>
              <Link to="/studenthome3">
                <FaChalkboardTeacher className="submenu-icon" /> Home3
              </Link>
            </li>
          </ul>
        </li>

        <li className={location.pathname === "/studentintro" ? "active" : ""}>
          <Link to="/studentintro">GIỚI THIỆU</Link>
        </li>
        <li className={location.pathname === "/studentcourses" ? "active" : ""}>
          <Link to="/studentcourses">KHÓA HỌC</Link>
        </li>
        <li className={location.pathname === "/studentdocs" ? "active" : ""}>
          <Link to="/studentdocs">TÀI LIỆU HỌC TẬP</Link>
        </li>
        <li className={location.pathname === "/studenthomework" ? "active" : ""}>
          <Link to="/studenthomework">BÀI TẬP</Link>
        </li>
        <li className={location.pathname === "/studentsupport" ? "active" : ""}>
          <Link to="/studentsupport">HỖ TRỢ HỌC TẬP</Link>
        </li>
        <li className={location.pathname.startsWith("/studentforum") ? "active" : ""}>
          <Link to="/studentforum">DIỄN ĐÀN</Link>
        </li>
        <li className={location.pathname === "/studentcontact" ? "active" : ""}>
          <Link to="/studentcontact">LIÊN HỆ</Link>
        </li>
      </ul>
    </div>
  );
}

export default StudentMenu;

import { Link } from "react-router-dom";
import { FaUserGraduate, FaSearch, FaBell, FaCog, FaQuestionCircle, FaUser, FaSignOutAlt, FaWrench, FaChalkboardTeacher, FaBook, FaHome} from "react-icons/fa";
import "./adminmenu.css";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function AdminMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const getAvatarUrl = () => {
    if (user?.avatar) {
      if (user.avatar.startsWith("http")) {
        return user.avatar;
      }
      return `${BASE_URL}${user.avatar}`;
    }
    return null;
  };

  return (
    <div className="menu-container">
      <div className="header">
        <h1 className="header-title">
          <FaUserGraduate className="header-icon" />
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
              <FaUserGraduate className="profile-icon" />
            )}
          </div>

          {isDropdownOpen && (
            <ul className="submenu-profile">
              <li>
              <Link to="/profile">
                <FaUser className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Hồ sơ</span>
              </Link>
              </li>
              <li>
                <Link to="/settings">
                  <FaWrench className="submenu-icon" />
                  <span style={{ marginLeft: "10px" }}>Tài khoản</span>
                </Link>
              </li>
              <li>
                <Link to="/logout" className="logout">
                  <FaSignOutAlt className="submenu-icon" />
                  <span style={{ marginLeft: "10px" }}>Đăng xuất</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <ul className="nav">
        <li>
          <Link to="/" className="menu-item">TRANG CHỦ ▾</Link>
          <ul className="submenu">
            <li>
              <Link to="/home1">
                <FaHome className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home1</span>
              </Link>
            </li>
            <li>
              <Link to="/home2">
                <FaBook className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home2</span>
              </Link>
            </li>
            <li>
              <Link to="/home3">
                <FaChalkboardTeacher className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home3</span>
              </Link>
            </li>
          </ul>
        </li>
        <li><Link to="/intro">GIỚI THIỆU</Link></li>
        <li><Link to="/courses">KHÓA HỌC</Link></li>
        <li><Link to="/teachers">GIÁO VIÊN</Link></li>
        <li><Link to="/registration">ĐĂNG KÝ HỌC</Link></li>
        <li><Link to="/media_coverage">VỀ CHÚNG TÔI</Link></li>
        <li><Link to="/parents_corner">GÓC PHỤ HUYNH</Link></li>
        <li><Link to="/contact">LIÊN HỆ</Link></li>
      </ul>
    </div>
  );
}

export default AdminMenu;

import { Link } from "react-router-dom";
import { FaUserGraduate, FaSearch, FaBell, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./adminmenu.css";
import { useState } from "react";

function AdminMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="menu-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">
          <FaUserGraduate className="header-icon" />
          <span className="header-text black">TOÁN </span>
          <span className="header-text black">HỌC </span>
          <span className="header-text blue">SINH </span>
          <span className="header-text blue">VIÊN </span>
        </h1>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar-container">
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Icons và User Profile */}
      <div className="icons-and-profile">
        <div className="icons-container">
          <FaBell className="header-icon" />
          <FaQuestionCircle className="header-icon" />
          <FaCog className="header-icon" />
        </div>

        {/* User Profile */}
        <div
          className="profile-dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <span className="profile-email">quan.dotrung@fss-user ▾</span>
          {isDropdownOpen && (
            <ul className="submenu-profile">
              <li><Link to="/profile">Hồ sơ</Link></li>
              <li><Link to="/settings">Cài đặt</Link></li>
              <li><Link to="/logout" className="logout">Đăng xuất</Link></li>
            </ul>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="nav">
        <li>
          <Link to="/" className="menu-item">TRANG CHỦ ▾</Link>
          <ul className="submenu">
            <li><Link to="/home1">Home 1</Link></li>
            <li><Link to="/home2">Home 2</Link></li>
            <li><Link to="/home3">Home 3</Link></li>
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

import { Link, useNavigate } from "react-router-dom";
import { FaUserGraduate, FaSearch, FaBell, FaCog, FaQuestionCircle, FaUser, FaSignOutAlt, FaWrench, FaChalkboardTeacher, FaBook, FaHome } from "react-icons/fa";
import "./studentmenu.css";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function StudentMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
              <li onClick={handleLogout} className="logout hover-effect">
                <FaSignOutAlt className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Đăng xuất</span>
              </li>

            </ul>
          )}
        </div>
      </div>

      <ul className="nav">
        <li>
          <Link to="/student" className="menu-item">TRANG CHỦ ▾</Link>
          <ul className="submenu">
            <li>
              <Link to="/studenthome1">
                <FaHome className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home1</span>
              </Link>
            </li>
            <li>
              <Link to="/studenthome2">
                <FaBook className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home2</span>
              </Link>
            </li>
            <li>
              <Link to="/studenthome3">
                <FaChalkboardTeacher className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home3</span>
              </Link>
            </li>
          </ul>
        </li>
        <li><Link to="/studentintro">GIỚI THIỆU</Link></li>
        <li><Link to="/studentcourses">KHÓA HỌC</Link></li>
        <li><Link to="/studentdocs">TÀI LIỆU HỌC TẬP</Link></li>
        <li><Link to="/studenthomework">BÀI TẬP & ĐÁNH GIÁ</Link></li>
        <li><Link to="/studentsupport">HỖ TRỢ HỌC TẬP</Link></li>
        <li><Link to="/studentforum">DIỄN ĐÀN</Link></li>
        <li><Link to="/studentcontact">LIÊN HỆ</Link></li>
      </ul>
    </div>
  );
}

export default StudentMenu;

import { Link } from "react-router-dom";
import { 
  FaCalculator, FaSearch, FaBell, FaCog, FaQuestionCircle, 
  FaUser, FaSignOutAlt, FaWrench, FaChalkboardTeacher, FaBook, FaHome 
} from "react-icons/fa";
import "./teachermenu.css";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function TeacherMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra đăng nhập và bắt buộc reload nếu trang được load từ cache
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.replace("/login");
    }
    // Nếu trang được load lại từ bộ nhớ cache (ấn Back) thì reload lại trang
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }, []);

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar.startsWith("http")
        ? user.avatar
        : `${BASE_URL}${user.avatar}`;
    }
    return null;
  };

  // Hàm đăng xuất: xóa dữ liệu và chuyển hướng bằng window.location.replace
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.replace("/login");
  };

  return (
    <div className="menu-container">
      <div className="header">
        <h1 className="header-title" style={{ marginBottom: "23px", fontSize: "28px"}}>
        <div className="header">
          <img src="/geometry.png" className="header-icon-math" alt="Calculator" />
          <span className="header-text black">Toán </span>
          <span className="header-text black">Học </span>
          <span className="header-text blue">Sinh </span>
          <span className="header-text blue">Viên </span>
        </div>
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
            <span className="profile-email">
              {user?.full_name || "Người dùng"}
            </span>
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
          <Link to="/teacher" className="menu-item">
            TRANG CHỦ ▾
          </Link>
          <ul className="submenu">
            <li>
              <Link to="/teacherhome1">
                <FaHome className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home1</span>
              </Link>
            </li>
            <li>
              <Link to="/teacherhome2">
                <FaBook className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home2</span>
              </Link>
            </li>
            <li>
              <Link to="/teacherhome3">
                <FaChalkboardTeacher className="submenu-icon" />
                <span style={{ marginLeft: "10px" }}>Home3</span>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/teacherintro">GIỚI THIỆU</Link>
        </li>
        <li>
          <Link to="/teachercourses/listcourses">KHÓA HỌC</Link>
        </li>
        <li>
          <Link to="/teacherdocs">TÀI LIỆU HỌC TẬP</Link>
        </li>
        <li>
          <Link to="/teacherhomework">BÀI TẬP</Link>
        </li>
        <li>
          <Link to="/teachersupport">HỖ TRỢ HỌC TẬP</Link>
        </li>
        <li>
          <Link to="/teacherforum">DIỄN ĐÀN</Link>
        </li>
        <li>
          <Link to="/teachercontact">LIÊN HỆ</Link>
        </li>
      </ul>
    </div>
  );
}

export default TeacherMenu;
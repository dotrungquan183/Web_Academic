import { Link, useLocation } from "react-router-dom";
import {
  FaCalculator, FaSearch, FaBell, FaCog, FaQuestionCircle,
  FaUser, FaSignOutAlt, FaWrench
} from "react-icons/fa";
import "./teachermenu.css";
import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:8000";

function TeacherMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      window.location.replace("/login");
    }

    if (token && storedUser) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
      } catch (err) {
        console.error("❌ Invalid token", err);
      }
    }

    window.onpageshow = (event) => {
      if (event.persisted) window.location.reload();
    };
  }, []);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      fetch(`${BASE_URL}/api/teacher/teacher_toolbar/teacher_notify/?user_id=${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể xác thực người dùng!");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
            const storedTotal = parseInt(localStorage.getItem(`${userId}_total`) || "0", 10);
            const difference = data.length - storedTotal;
            setUnreadCount(difference > 0 ? difference : 0);
          } else {
            setNotifications([]);
            setUnreadCount(0);
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi khi tải thông báo:", err.message);
          setNotifications([]);
          setUnreadCount(0);
        });
    }
  }, [userId, token]);

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`;
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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

  const toggleNotification = () => {
    const opened = !isNotificationOpen;
    setIsNotificationOpen(opened);

    if (opened) {
      // Khi mở dropdown lần đầu, lưu tổng số vào localStorage
      if (userId) {
        localStorage.setItem(`${userId}_total`, notifications.length.toString());
        setUnreadCount(0); // Reset hiển thị
      }
    }
  };

  // 🔒 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="menu-container">
      <div className="header">
        <h1 className="header-title" style={{ marginBottom: "23px", fontSize: "28px" }}>
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
          <div className="notification-wrapper" style={{ position: "relative" }} ref={notificationRef}>
            <FaBell
              className="header-icon"
              onClick={toggleNotification}
              title="Thông báo"
              style={{ cursor: "pointer" }}
            />
            {unreadCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  zIndex: 1
                }}
              >
                {unreadCount}
              </div>
            )}

            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <span className="notification-title">Thông báo</span>
                  <span className="notification-close" onClick={toggleNotification}>×</span>
                </div>

                {notifications.length === 0 ? (
                  <div className="notification-item">Không có thông báo nào.</div>
                ) : (
                  notifications.map((noti, idx) => (
                    <div key={idx} className="notification-item">
                      <span>
                        <strong>{noti.answer_user}</strong> đã trả lời câu hỏi:{" "}
                        <em style={{ color: "red" }}>"{noti.question_title}"</em>:{" "}
                        <span style={{ color: "#003366" }}>{noti.answer_content}</span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}



          </div>

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
                <Link to="/teacherprofile/forum">
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

      <ul className="nav">
        <li className={location.pathname === "/teacherintro" ? "active" : ""}>
          <Link to="/teacherintro">GIỚI THIỆU</Link>
        </li>
        <li className={location.pathname === "/teachercourses/listcourses" ? "active" : ""}>
          <Link to="/teachercourses/listcourses">DANH SÁCH KHÓA HỌC</Link>
        </li>
        <li className={location.pathname === "/teacherresult" ? "active" : ""}>
          <Link to="/teacherresult">TÌNH TRẠNG HỌC TẬP</Link>
        </li>
        <li className={location.pathname.startsWith("/teacherforum") ? "active" : ""}>
          <Link to="/teacherforum">DIỄN ĐÀN HỌC TẬP</Link>
        </li>
        <li className={location.pathname === "/teachercontact" ? "active" : ""}>
          <Link to="/teachercontact">LIÊN HỆ</Link>
        </li>
      </ul>
    </div>
  );
}

export default TeacherMenu;

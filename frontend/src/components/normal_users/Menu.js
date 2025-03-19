import { Link } from "react-router-dom";
import { FaUserGraduate, FaSearch } from "react-icons/fa"; // Import icon kính lúp
import "./menu.css";

function Menu() {
  return (
    <div>
      {/* Header */}
      <h1 className="header-title">
        <FaUserGraduate className="header-icon" />
        <span className="header-text black">TOÁN </span>
        <span className="header-text black">HỌC </span>
        <span className="header-text blue">SINH </span>
        <span className="header-text blue">VIÊN </span>

        {/* 🔎 Thanh tìm kiếm */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
          <FaSearch className="search-icon" />
        </div>

        {/* 📌 Nút đăng ký & đăng nhập */}
        <div className="auth-buttons">
          <Link to="/register" className="register-button">ĐĂNG KÝ</Link>
          <Link to="/login" className="login-button">ĐĂNG NHẬP</Link>
        </div>
      </h1>

      {/* Menu Navigation */}
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

export default Menu;

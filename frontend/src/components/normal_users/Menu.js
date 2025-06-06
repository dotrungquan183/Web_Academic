import { Link } from "react-router-dom";
import { FaSearch} from "react-icons/fa"; 
import "./menu.css";

function Menu() {
  return (
    <div>
      {/* Header */}
      <h1 className="header-title">
        <div className="header">
          <img src="/geometry.png" className="header-icon-math" alt="Calculator" />
          <span className="header-text black">Toán </span>
          <span className="header-text black">Học </span>
          <span className="header-text blue">Phổ </span>
          <span className="header-text blue">Thông </span>
        </div>

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

      {/*
      <ul className="nav">
        <li className="has-submenu">
          <Link
            to="/"
            className="menu-item no-underline"
            style={{ textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.preventDefault();
              e.target.style.textDecoration = 'none';
            }}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            TRANG CHỦ
          </Link>
        </li>
        <li><Link to="/intro">GIỚI THIỆU</Link></li>
        <li><Link to="/courses">KHÓA HỌC</Link></li>
        <li><Link to="/teachers">GIÁO VIÊN</Link></li>
        <li><Link to="/registration">ĐĂNG KÝ HỌC</Link></li>
        <li><Link to="/media_coverage">VỀ CHÚNG TÔI</Link></li>
        <li><Link to="/parents_corner">GÓC PHỤ HUYNH</Link></li>
        <li><Link to="/contact">LIÊN HỆ</Link></li>
      </ul>
      */}
    </div>
  );
}

export default Menu;

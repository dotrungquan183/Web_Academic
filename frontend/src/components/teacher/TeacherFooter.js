import './teacherfooter.css';
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';

function TeacherFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <img src="/geo.png" alt="F8 Logo" className="footer-logo" />
          <h3 className="footer-title">Học Lập Trình Để Đi Làm</h3>
          <p><strong>Điện thoại:</strong> 08 1919 8989</p>
          <p><strong>Email:</strong> contact@fullstack.edu.vn</p>
          <p><strong>Địa chỉ:</strong> Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</p>
        </div>

        <div className="footer-section">
          <h4>Về F8</h4>
          <ul>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Điều khoản</li>
            <li>Bảo mật</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Sản phẩm</h4>
          <ul>
            <li>Game Nester</li>
            <li>Game CSS Diner</li>
            <li>Game CSS Selectors</li>
            <li>Game Froggy</li>
            <li>Game Froggy Pro</li>
            <li>Game Scoops</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Công cụ</h4>
          <ul>
            <li>Tạo CV xin việc</li>
            <li>Rút gọn liên kết</li>
            <li>Clip-path maker</li>
            <li>Snippet generator</li>
            <li>CSS Grid generator</li>
            <li>Cảnh báo sờ tay lên mặt</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC F8</h4>
          <p><strong>Mã số thuế:</strong> 0109922901</p>
          <p><strong>Ngày thành lập:</strong> 04/03/2022</p>
          <p><strong>Lĩnh vực hoạt động:</strong> Giáo dục, công nghệ - lập trình. Chúng tôi tập trung xây dựng và phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.</p>
          <div className="footer-socials">
            <FaYoutube className="social-icon" />
            <FaFacebookF className="social-icon" />
            <FaTiktok className="social-icon" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2018 - 2025 F8. Nền tảng học lập trình hàng đầu Việt Nam
      </div>
    </footer>
  );
}

export default TeacherFooter;

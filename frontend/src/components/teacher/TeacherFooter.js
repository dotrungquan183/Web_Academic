import './teacherfooter.css';
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';

function TeacherFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <img src="/geo.png" alt="Math Logo" className="footer-logo" />
          <h3 className="footer-title">Học Toán Để Vượt Trội</h3>
          <p><strong>Website:</strong> www.hoctoan.vn</p>
          <p><strong>Email:</strong> support@hoctoan.vn</p>
          <p><strong>Địa chỉ:</strong> Hà Nội, Việt Nam</p>
        </div>

        <div className="footer-section">
          <h4>Về Chúng Tôi</h4>
          <ul>
            <li>Nền tảng học Toán trực tuyến</li>
            <li>Đội ngũ giáo viên nhiệt huyết</li>
            <li>Học qua ví dụ, thực hành bài tập</li>
            <li>Định hướng tự học hiệu quả</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Chương Trình Học</h4>
          <ul>
            <li>Toán Cơ Bản & Nâng Cao</li>
            <li>Ôn luyện theo lớp</li>
            <li>Toán thi vào 10 & Đại học</li>
            <li>Toán thực tế & ứng dụng</li>
            <li>Lý thuyết + bài tập minh họa</li>
            <li>Kiểm tra đánh giá định kỳ</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Tiện Ích Cho Học Sinh</h4>
          <ul>
            <li>Máy tính & giải phương trình</li>
            <li>Ngân hàng câu hỏi trắc nghiệm</li>
            <li>Vẽ đồ thị online</li>
            <li>Lịch học & nhắc nhở</li>
            <li>Tổng hợp công thức quan trọng</li>
            <li>Góc chia sẻ mẹo học Toán</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Giới Thiệu Nền Tảng</h4>
          <p>
            Đây là nền tảng học Toán trực tuyến dành cho học sinh từ cấp 2 đến cấp 3. Nội dung được biên soạn dễ hiểu, 
            gần gũi và phù hợp với chương trình học phổ thông. Chúng tôi tin rằng ai cũng có thể học tốt Toán nếu có phương pháp phù hợp.
          </p>
          <div className="footer-socials">
            <FaYoutube className="social-icon" />
            <FaFacebookF className="social-icon" />
            <FaTiktok className="social-icon" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2020 - 2025 Học Toán VN. Cùng nhau chinh phục Toán học một cách đơn giản và thú vị!
      </div>
    </footer>
  );
}

export default TeacherFooter;

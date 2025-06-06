const containerStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)", // nền trong suốt nhẹ
  padding: "40px 60px",
  borderRadius: "0px", // góc vuông
  border: "none", // bỏ viền nếu không cần
  margin: "0 auto",
  width: "100vw", // chiếm toàn bộ chiều ngang
  maxWidth: "100vw",
  color: "#003366",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  lineHeight: "1.8",
  display: "flex",
  gap: "60px",
  minHeight: "400px",
  justifyContent: "center",
  boxSizing: "border-box", // tránh tràn layout
};

const leftBoxStyle = {
  flex: 1,
  borderRight: "2px solid #eee",
  paddingRight: "40px",
  textAlign: "left",
};

const rightBoxStyle = {
  flex: 1,
  paddingLeft: "40px",
  textAlign: "left",
};

const titleStyle = {
  fontSize: "30px",
  fontWeight: "700",
  marginBottom: "25px",
  color: "#004080",
  letterSpacing: "1.2px",
};

const paragraphStyle = {
  fontSize: "16px",
  marginBottom: "28px",
};

const listStyle = {
  listStyleType: "none",
  paddingLeft: 0,
  fontSize: "16px",
  lineHeight: 1.8,
};

const listItemStyle = {
  marginBottom: "28px",
  display: "flex",
  alignItems: "flex-start",
};

const iconStyle = {
  marginRight: "18px",
  fontSize: "18px",
  flexShrink: 0,
  marginTop: "4px",
};

const listTextStyle = {
  lineHeight: 1.3,
};

function TeacherContactTab() {
  return (
    <div style={containerStyle}>
      <div style={leftBoxStyle}>
        <h2 style={titleStyle}>📞 Chăm sóc khách hàng</h2>
        <p style={paragraphStyle}>
          Chúng tôi hiểu rằng việc sử dụng hệ thống quản lý giáo dục trực tuyến đôi khi có thể phát sinh những thắc mắc hoặc vấn đề cần hỗ trợ kịp thời. Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng đồng hành cùng bạn để đảm bảo trải nghiệm sử dụng suôn sẻ và hiệu quả nhất.
        </p>
        <p style={paragraphStyle}>
          Bạn có thể liên hệ với chúng tôi qua nhiều kênh khác nhau, từ điện thoại, email đến hệ thống chat trực tiếp trên nền tảng. Mọi câu hỏi về kỹ thuật, chức năng, hoặc đề xuất cải tiến đều được tiếp nhận và phản hồi nhanh chóng.
        </p>
        <p style={paragraphStyle}>
          Chúng tôi cam kết luôn đặt khách hàng lên hàng đầu với thái độ tận tâm, chuyên nghiệp và thân thiện. Mỗi phản hồi của bạn là động lực để chúng tôi phát triển và hoàn thiện hệ thống ngày càng tốt hơn.
        </p>
        <p style={paragraphStyle}>
          Đừng ngần ngại chia sẻ mọi khó khăn bạn gặp phải – chúng tôi sẽ giúp bạn tìm ra giải pháp hiệu quả nhất.
        </p>
      </div>

      <div style={rightBoxStyle}>
        <h3 style={{ ...titleStyle, fontSize: "26px" }}>✨ Các kênh liên hệ chính</h3>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <span role="img" aria-label="phone" style={iconStyle}>📱</span>
            <span style={listTextStyle}>
              <strong>Điện thoại hỗ trợ:</strong> Hotline 1900-1234, hoạt động từ 8:00 – 20:00 tất cả các ngày trong tuần, kể cả ngày lễ.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="email" style={iconStyle}>📧</span>
            <span style={listTextStyle}>
              <strong>Email hỗ trợ:</strong> support@eduplatform.com – chúng tôi cam kết trả lời email trong vòng 24 giờ làm việc.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="chat" style={iconStyle}>💬</span>
            <span style={listTextStyle}>
              <strong>Chat trực tuyến:</strong> Trò chuyện trực tiếp với bộ phận kỹ thuật và chăm sóc khách hàng ngay trên nền tảng, giúp giải quyết nhanh mọi vướng mắc.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="faq" style={iconStyle}>❓</span>
            <span style={listTextStyle}>
              <strong>Hỏi đáp thường gặp:</strong> Truy cập trang FAQ để tìm hiểu các câu hỏi phổ biến và hướng dẫn sử dụng chi tiết.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="location" style={iconStyle}>🏢</span>
            <span style={listTextStyle}>
              <strong>Văn phòng làm việc:</strong> 123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh – đón tiếp khách hàng vào giờ hành chính từ thứ 2 đến thứ 6.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="support" style={iconStyle}>🛠️</span>
            <span style={listTextStyle}>
              <strong>Hỗ trợ kỹ thuật 24/7:</strong> Đội ngũ chuyên viên trực hotline kỹ thuật sẵn sàng xử lý sự cố bất cứ lúc nào.
            </span>
          </li>
          <li style={listItemStyle}>
            <span role="img" aria-label="feedback" style={iconStyle}>📝</span>
            <span style={listTextStyle}>
              <strong>Gửi phản hồi và đề xuất:</strong> Chúng tôi rất mong nhận được ý kiến đóng góp để không ngừng cải thiện sản phẩm và dịch vụ.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TeacherContactTab;

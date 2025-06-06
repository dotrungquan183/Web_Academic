import React, { useState } from "react";

const containerStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.92)", 
  padding: "40px 60px",
  borderRadius: "0",
  border: "1px solid rgba(200, 200, 200, 0.6)",
  margin: "0",
  width: "100vw",
  color: "#003366",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  lineHeight: "1.8",
  display: "flex",
  gap: "60px",
  minHeight: "400px",
  justifyContent: "center",
  backdropFilter: "blur(6px)",
  boxSizing: "border-box",
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
  marginBottom: "16px",
  display: "flex",
  alignItems: "flex-start",
};

const iconStyle = {
  marginRight: "18px",
  fontSize: "16px",
  flexShrink: 0,
  marginTop: "4px",
};

const listTextStyle = {
  lineHeight: 1.3,
};

function StudentIntroTab() {
  const [data] = useState(null);

  return (
    <div style={containerStyle}>
      {data ? (
        <p>{data.content}</p>
      ) : (
        <>
          <div style={leftBoxStyle}>
            <h2 style={titleStyle}>🎓 Giới thiệu về hệ thống</h2>
            <p style={paragraphStyle}>
              Chào mừng bạn đến với <strong>Hệ thống Quản lý Giáo dục trực tuyến</strong> – nền tảng học tập toàn diện được thiết kế dành riêng cho học viên. Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng truy cập và quản lý các khóa học của mình.
            </p>
            <p style={paragraphStyle}>
              Hệ thống hỗ trợ bạn tiếp cận tài liệu học tập, theo dõi tiến độ học tập và giao tiếp với giáo viên cũng như bạn bè cùng lớp.
            </p>
            <p style={paragraphStyle}>
              Chúng tôi cam kết đồng hành cùng bạn trong hành trình học tập, giúp nâng cao kiến thức và phát triển kỹ năng một cách hiệu quả.
            </p>
          </div>
          <div style={rightBoxStyle}>
            <h3 style={{ ...titleStyle, fontSize: "26px" }}>✨ Các chức năng chính</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <span role="img" aria-label="book" style={iconStyle}>📚</span>
                <span style={listTextStyle}><strong>Quản lý khóa học:</strong> Truy cập, học tập và theo dõi tiến độ các khóa học bạn đã đăng ký.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="speech" style={iconStyle}>💬</span>
                <span style={listTextStyle}><strong>Diễn đàn học tập:</strong> Trao đổi, thảo luận và chia sẻ kinh nghiệm với bạn bè và giáo viên.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="clock" style={iconStyle}>⏰</span>
                <span style={listTextStyle}><strong>Quản lý thời gian học tập:</strong> Lên kế hoạch học tập và nhận thông báo nhắc nhở.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="chart" style={iconStyle}>📊</span>
                <span style={listTextStyle}><strong>Báo cáo & thống kê:</strong> Theo dõi kết quả học tập với các báo cáo chi tiết.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="shield" style={iconStyle}>🛡️</span>
                <span style={listTextStyle}><strong>Bảo mật dữ liệu:</strong> Bảo vệ thông tin cá nhân và kết quả học tập của bạn.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="mobile" style={iconStyle}>📱</span>
                <span style={listTextStyle}><strong>Hỗ trợ đa nền tảng:</strong> Truy cập dễ dàng từ điện thoại, máy tính bảng và máy tính để bàn.</span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="support" style={iconStyle}>🛠️</span>
                <span style={listTextStyle}><strong>Hỗ trợ kỹ thuật:</strong> Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn khi cần.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentIntroTab;

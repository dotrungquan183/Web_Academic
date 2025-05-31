import React, { useState } from "react";

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "40px 60px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  margin: "50px auto",
  width: "1300px",
  maxWidth: "95vw",
  color: "#003366",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  lineHeight: "1.8",
  display: "flex",
  gap: "60px",
  minHeight: "400px",
  justifyContent: "center",
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
  fontSize: "16px",    // tăng font chữ giống bên trái
  lineHeight: 1.8,     // dòng cao như bên trái
};

const listItemStyle = {
  marginBottom: "16px",  // tăng marginBottom giống paragraph bên trái
  display: "flex",
  alignItems: "flex-start", // align top để text không bị lệch
};

const iconStyle = {
  marginRight: "18px",
  fontSize: "16px",
  flexShrink: 0,
  marginTop: "4px", // căn icon cho thẳng hàng text
};


const listTextStyle = {
  lineHeight: 1.3,
};

function TeacherIntroTab() {
  const [data] = useState(null);

  return (
    <div style={containerStyle}>
      {data ? (
        <p>{data.content}</p>
      ) : (
        <>
          <div style={leftBoxStyle}>
            <h2 style={titleStyle}>👩‍🏫 Giới thiệu về hệ thống dành cho giáo viên</h2>
            <p style={paragraphStyle}>
              Chào mừng bạn đến với <strong>Hệ thống Quản lý Giáo dục trực tuyến</strong> – nền tảng toàn diện và tiện lợi được thiết kế dành riêng cho giáo viên. Giao diện thân thiện, dễ sử dụng, giúp tối ưu hóa quy trình giảng dạy và quản lý học viên.
            </p>
            <p style={paragraphStyle}>
              Hệ thống hỗ trợ bạn tập trung vào việc nâng cao chất lượng giảng dạy, đồng thời tạo điều kiện thuận lợi để trao đổi kinh nghiệm và kết nối với đồng nghiệp.
            </p>
            <p style={paragraphStyle}>
              Chúng tôi cam kết đồng hành cùng bạn trong mọi hoạt động quản lý lớp học, hỗ trợ phát triển năng lực cá nhân và nâng cao hiệu quả giáo dục.
            </p>
          </div>
          <div style={rightBoxStyle}>
            <h3 style={{ ...titleStyle, fontSize: "26px" }}>✨ Các chức năng chính</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <span role="img" aria-label="book" style={iconStyle}>
                  📚
                </span>
                <span style={listTextStyle}>
                  <strong>Quản lý khóa học:</strong> Tạo mới, cập nhật, quản lý tài liệu và theo dõi tiến độ học tập của học viên một cách dễ dàng.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="speech" style={iconStyle}>
                  💬
                </span>
                <span style={listTextStyle}>
                  <strong>Diễn đàn giáo viên:</strong> Trao đổi, thảo luận và chia sẻ kinh nghiệm giảng dạy cùng các đồng nghiệp.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="clock" style={iconStyle}>
                  ⏰
                </span>
                <span style={listTextStyle}>
                  <strong>Quản lý thời gian:</strong> Lên kế hoạch giảng dạy và nhận thông báo nhắc nhở hiệu quả.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="chart" style={iconStyle}>
                  📊
                </span>
                <span style={listTextStyle}>
                  <strong>Báo cáo và thống kê:</strong> Theo dõi hiệu suất giảng dạy qua các báo cáo chi tiết.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="shield" style={iconStyle}>
                  🛡️
                </span>
                <span style={listTextStyle}>
                  <strong>Bảo mật dữ liệu:</strong> Đảm bảo an toàn thông tin cá nhân và khóa học.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="mobile" style={iconStyle}>
                  📱
                </span>
                <span style={listTextStyle}>
                  <strong>Hỗ trợ đa nền tảng:</strong> Sử dụng trên cả điện thoại và máy tính với trải nghiệm đồng nhất.
                </span>
              </li>
              <li style={listItemStyle}>
                <span role="img" aria-label="support" style={iconStyle}>
                  🛠️
                </span>
                <span style={listTextStyle}>
                  <strong>Hỗ trợ kỹ thuật:</strong> Đội ngũ chăm sóc khách hàng sẵn sàng giúp bạn khi cần.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherIntroTab;

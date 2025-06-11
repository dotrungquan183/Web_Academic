import React, { useState } from "react";

const styles = {
  pageWrapper: {
    background: "#fff",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginBottom: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    background: "#fafafa",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#003366",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
  },
  column: {
    flex: "1",
    minWidth: "300px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  statCard: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  statTitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#222",
  },
  dateFilter: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logoPreview: {
    maxWidth: "150px",
    maxHeight: "150px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};


const AdminManageDetailAccount = () => {
  const [systemInfo, setSystemInfo] = useState({
    name: "EduConnect Portal",
    description: "Trang quản trị hệ thống giáo dục nội bộ",
    email: "support@educonnect.vn",
    hotline: "1800 6868",
    address: "12 Nguyễn Văn Bảo, Q. Gò Vấp, TP. Hồ Chí Minh",
    logo: "", // This will store the actual File object
  });

  const [logoPreview, setLogoPreview] = useState(null); // For preview
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [maintenance, setMaintenance] = useState({ from: "", to: "", note: "" });

  const stats = [
    { title: "Tổng số người dùng", value: 1240 },
    { title: "Tổng request trong ngày", value: 30892 },
    { title: "Sử dụng CPU", value: "35%" },
    { title: "Sử dụng RAM", value: "62%" },
    { title: "Tổng số bài đăng", value: 894 },
    { title: "Báo cáo gần đây", value: 12 },
  ];

  const handleInputChange = (field, value) => {
    setSystemInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaintenanceChange = (field, value) => {
    setMaintenance((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSystemInfo((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file)); // Create URL for preview
    }
  };

  const handleBackup = () => {
    alert("Đã tiến hành backup dữ liệu hệ thống.");
  };

  const handleSaveMaintenance = () => {
    alert(`Đã lưu lịch bảo trì từ ${maintenance.from} đến ${maintenance.to}`);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Bộ lọc thống kê */}
      <div style={styles.section}>
        <div style={styles.dateFilter}>
          <div>
            <label style={styles.label}>Từ ngày:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Đến ngày:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.sectionTitle}>Cấu hình máy chủ</div>
        <div style={styles.statsGrid}>
          {stats.map((stat, idx) => {
            const cardColors = [
              "#d1ecf1", "#d4edda", "#fff3cd", "#f8d7da", "#e2e3e5", "#fefefe",
            ];
            const bgColor = cardColors[idx % cardColors.length];
            return (
              <div
                key={idx}
                style={{
                  ...styles.statCard,
                  backgroundColor: bgColor,
                  border: "1px solid #ccc",
                }}
              >
                <div style={styles.statTitle}>{stat.title}</div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Thống kê dữ liệu */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Dữ liệu</div>
        <div style={styles.statsGrid}>
          {[
            { title: "Dung lượng cơ sở dữ liệu", value: "524 MB" },
            { title: "Tổng số bảng", value: 37 },
            { title: "Tổng số bản ghi", value: "2,481,943" },
            { title: "Bảng lớn nhất", value: "orders (1.2M bản ghi)" },
            { title: "Tốc độ tăng trưởng dữ liệu", value: "12% / tháng" },
          ].map((stat, idx) => {
            const cardColors = [
              "#f0f9ff", "#fef3c7", "#ecfccb", "#fde2e4", "#e0f2fe", "#ede9fe", "#fff7ed",
            ];
            const bgColor = cardColors[idx % cardColors.length];
            return (
              <div
                key={idx}
                style={{
                  ...styles.statCard,
                  backgroundColor: bgColor,
                  border: "1px solid #ccc",
                }}
              >
                <div style={styles.statTitle}>{stat.title}</div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Thông tin hệ thống</div>
        <div style={styles.formRow}>
          {/* Cột trái */}
          <div style={styles.column}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tên hệ thống:</label>
              <input
                type="text"
                value={systemInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Giới thiệu:</label>
              <textarea
                value={systemInfo.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                style={{ ...styles.input, height: "80px", resize: "vertical" }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email liên hệ:</label>
              <input
                type="email"
                value={systemInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hotline:</label>
              <input
                type="text"
                value={systemInfo.hotline}
                onChange={(e) => handleInputChange("hotline", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Cột phải */}
          <div style={styles.column}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tải lên Logo:</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} style={styles.input} />
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" style={styles.logoPreview} />
              )}
            </div>
          </div>
        </div>

        <button style={styles.button}>Cập nhật thông tin</button>
      </div>


      {/* Bảo trì hệ thống */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Bảo trì hệ thống</div>
        <div style={styles.dateFilter}>
          <div>
            <label style={styles.label}>Từ ngày:</label>
            <input
              type="date"
              value={maintenance.from}
              onChange={(e) => handleMaintenanceChange("from", e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Đến ngày:</label>
            <input
              type="date"
              value={maintenance.to}
              onChange={(e) => handleMaintenanceChange("to", e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Lý do bảo trì:</label>
          <textarea
            value={maintenance.note}
            onChange={(e) => handleMaintenanceChange("note", e.target.value)}
            style={{ ...styles.input, height: "80px", resize: "vertical" }}
          />
        </div>
        <button style={styles.button} onClick={handleBackup}>Backup dữ liệu</button>
        <button
          style={{ ...styles.button, backgroundColor: "#28a745" }}
          onClick={handleSaveMaintenance}
        >
          Lưu lịch bảo trì
        </button>
      </div>
    </div>
  );
};

export default AdminManageDetailAccount;

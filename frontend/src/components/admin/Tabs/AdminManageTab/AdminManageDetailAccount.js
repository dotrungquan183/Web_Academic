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
  autoConfigRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "15px",
  },

  switch: {
    width: "50px",
    height: "26px",
    borderRadius: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s",
    padding: "2px",
  },

  switchCircle: {
    width: "22px",
    height: "22px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    transition: "transform 0.3s",
  },

  dateInline: {
    display: "flex",
    alignItems: "center",
  }
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
  const [autoApprove, setAutoApprove] = useState({
    question: true,
    answer: false,
    comment: false,
    courses: false, // ✅ Bổ sung courses vào đây

  });
  const handleSaveAutoApproveConfig = () => {
    console.log("Lưu cấu hình:", {
      autoApprove,
      applyFrom,
      applyTo
    });

    alert("Đã lưu cấu hình duyệt tự động.");
  };

  const [applyFrom, setApplyFrom] = useState("2025-06-13");
  const [applyTo, setApplyTo] = useState("2025-12-31");

  const [permissions, setPermissions] = useState([
    { action_key: 'ask_question', description: 'Đặt câu hỏi', min_reputation: 1 },
    { action_key: 'post_answer', description: 'Trả lời câu hỏi', min_reputation: 15 },
    { action_key: 'vote', description: 'Bình chọn (upvote/downvote)', min_reputation: 20 },
    { action_key: 'comment', description: 'Bình luận', min_reputation: 50 },
  ]);
  const [permission, setPermission] = useState({ action_key: '', description: '', min_reputation: 0 });
  const [selectedPermissionKey, setSelectedPermissionKey] = useState(null);

  const handlePermissionChange = (field, value) => {
    setPermission(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectPermission = (perm) => {
    setPermission(perm);
    setSelectedPermissionKey(perm.action_key);
  };

  const handleAddPermission = () => {
    if (permissions.some(p => p.action_key === permission.action_key)) {
      alert("Hành động đã tồn tại. Dùng nút Cập nhật.");
      return;
    }
    setPermissions(prev => [...prev, permission]);
    resetPermissionForm();
  };

  const handleUpdatePermission = () => {
    if (!selectedPermissionKey) {
      alert("Chọn hành động để cập nhật.");
      return;
    }
    setPermissions(prev =>
      prev.map(p => p.action_key === selectedPermissionKey ? permission : p)
    );
    resetPermissionForm();
  };

  const handleDeletePermission = () => {
    if (!selectedPermissionKey) {
      alert("Chọn hành động để xóa.");
      return;
    }
    setPermissions(prev =>
      prev.filter(p => p.action_key !== selectedPermissionKey)
    );
    resetPermissionForm();
  };

  const resetPermissionForm = () => {
    setPermission({ action_key: '', description: '', min_reputation: 0 });
    setSelectedPermissionKey(null);
  };

  const [reputationRules, setReputationRules] = useState([
    { rule_key: 'new_user', description: 'Người dùng mới', point_change: 5 },
    { rule_key: 'upvote_answer', description: 'Câu trả lời được upvote', point_change: 10 },
    { rule_key: 'upvote_question', description: 'Câu hỏi được upvote', point_change: 5 },
    { rule_key: 'answer_accepted', description: 'Câu trả lời được chọn đúng', point_change: 15 },
    { rule_key: 'downvote_received', description: 'Câu hỏi/câu trả lời bị downvote', point_change: -2 },
    { rule_key: 'downvote_given', description: 'Downvote người khác', point_change: -1 },
  ]);
  const [reputationRule, setReputationRule] = useState({ rule_key: '', description: '', point_change: 0 });

  const handleReputationChange = (field, value) => {
    setReputationRule(prev => ({ ...prev, [field]: value }));
  };

  const handleAddReputationRule = () => {
    setReputationRules(prev => {
      const existingIndex = prev.findIndex(r => r.rule_key === reputationRule.rule_key);
      if (existingIndex !== -1) {
        // Update rule nếu đã tồn tại
        const updated = [...prev];
        updated[existingIndex] = reputationRule;
        return updated;
      } else {
        return [...prev, reputationRule];
      }
    });
    setReputationRule({ rule_key: '', description: '', point_change: 0 });
  };

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
          {/* Cột trái - Thông tin hệ thống */}
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

          {/* Cột phải - Upload logo */}
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
        <div style={styles.formRow}>
          <div style={{ ...styles.column, width: "100%" }}>
            <h3 style={{ fontWeight: "bold", marginTop: "20px" }}>Phân quyền theo điểm uy tín</h3>

            {/* Form nhập quyền */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hành động (key):</label>
              <input
                type="text"
                value={permission.action_key}
                onChange={(e) => handlePermissionChange("action_key", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mô tả:</label>
              <input
                type="text"
                value={permission.description}
                onChange={(e) => handlePermissionChange("description", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Điểm uy tín tối thiểu:</label>
              <input
                type="number"
                value={permission.min_reputation}
                onChange={(e) => handlePermissionChange("min_reputation", parseInt(e.target.value))}
                style={styles.input}
              />
            </div>

            {/* Nút thao tác */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleAddPermission} style={styles.button}>Thêm</button>
              <button onClick={handleUpdatePermission} style={{ ...styles.button, backgroundColor: "#28a745" }}>Cập nhật</button>
              <button onClick={handleDeletePermission} style={{ ...styles.button, backgroundColor: "#dc3545" }}>Xóa</button>
            </div>

            {/* Bảng danh sách */}
            <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Hành động</th>
                  <th style={styles.tableHeader}>Mô tả</th>
                  <th style={styles.tableHeader}>Điểm uy tín tối thiểu</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, index) => (
                  <tr key={index} onClick={() => handleSelectPermission(perm)} style={{ cursor: "pointer" }}>
                    <td style={styles.tableCell}>{perm.action_key}</td>
                    <td style={styles.tableCell}>{perm.description}</td>
                    <td style={styles.tableCell}>{perm.min_reputation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KHUNG CHỈNH SỬA REPUTATION */}
        <div style={styles.formRow}>
          <div style={{ ...styles.column, width: "100%" }}>
            <h3 style={{ fontWeight: "bold", marginTop: "20px" }}>Quy tắc tính điểm uy tín</h3>

            {/* Form thêm/sửa quy tắc */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Quy tắc:</label>
              <input
                type="text"
                value={reputationRule.rule_key}
                onChange={(e) => handleReputationChange("rule_key", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mô tả:</label>
              <input
                type="text"
                value={reputationRule.description}
                onChange={(e) => handleReputationChange("description", e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Thay đổi điểm:</label>
              <input
                type="number"
                value={reputationRule.point_change}
                onChange={(e) => handleReputationChange("point_change", parseInt(e.target.value))}
                style={styles.input}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleAddReputationRule} style={styles.button}>
                Thêm
              </button>
              <button style={{ ...styles.button, backgroundColor: "#28a745" }}>
                Cập nhật
              </button>
              <button style={{ ...styles.button, backgroundColor: "#dc3545" }}>
                Xóa
              </button>
            </div>


            {/* Bảng hiển thị quy tắc hiện tại */}
            <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Quy tắc</th>
                  <th style={styles.tableHeader}>Mô tả</th>
                  <th style={styles.tableHeader}>Điểm thay đổi</th>
                </tr>
              </thead>
              <tbody>
                {reputationRules.map((rule, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{rule.rule_key}</td>
                    <td style={styles.tableCell}>{rule.description}</td>
                    <td style={styles.tableCell}>{rule.point_change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <button style={styles.button}>Cập nhật thông tin</button>
      </div>
      <div style={styles.formRow}>
        <div style={{ ...styles.column, width: "100%" }}>
          <h3 style={{ fontWeight: "bold", marginTop: "20px" }}>Cấu hình hệ thống tự động duyệt</h3>

          {["question", "answer", "comment", "courses"].map((type) => (
            <div key={type} style={styles.autoConfigRow}>
              <label style={styles.label}>
                {type === "question"
                  ? "Câu hỏi"
                  : type === "answer"
                    ? "Câu trả lời"
                    : type === "courses"
                      ? "Khóa học"                    
                    : "Bình luận"}
              </label>

              {/* Switch ON/OFF */}
              <div
                onClick={() =>
                  setAutoApprove((prev) => ({
                    ...prev,
                    [type]: {
                      ...prev[type],
                      enabled: !prev[type].enabled,
                    },
                  }))
                }
                style={{
                  ...styles.switch,
                  backgroundColor: autoApprove[type].enabled ? "#4caf50" : "#f44336",
                }}
              >
                <div
                  style={{
                    ...styles.switchCircle,
                    transform: autoApprove[type].enabled
                      ? "translateX(26px)"
                      : "translateX(2px)",
                  }}
                />
              </div>

              {/* Từ - đến */}
              <div style={styles.dateInline}>
                <input
                  type="date"
                  value={autoApprove[type].from}
                  onChange={(e) =>
                    setAutoApprove((prev) => ({
                      ...prev,
                      [type]: {
                        ...prev[type],
                        from: e.target.value,
                      },
                    }))
                  }
                  style={styles.input}
                />
                <span style={{ margin: "0 5px" }}>→</span>
                <input
                  type="date"
                  value={autoApprove[type].to}
                  onChange={(e) =>
                    setAutoApprove((prev) => ({
                      ...prev,
                      [type]: {
                        ...prev[type],
                        to: e.target.value,
                      },
                    }))
                  }
                  style={styles.input}
                />
              </div>
            </div>
          ))}

          {/* Nút lưu */}
          <div style={{ marginTop: "0px", marginBottom: "30px" }}>
            <button onClick={handleSaveAutoApproveConfig} style={styles.button}>
              Lưu cấu hình
            </button>
          </div>
        </div>
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

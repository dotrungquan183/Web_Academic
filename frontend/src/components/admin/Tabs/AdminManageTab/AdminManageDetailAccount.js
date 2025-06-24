import React, { useState, useEffect  } from "react";
import { getToken } from "../../../auth/authHelper";

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
  // ----------------- Auto Approve ----------------- //
  const [autoApprove, setAutoApprove] = useState({
    question: { enabled: false, from: "", to: "" },
    answer: { enabled: false, from: "", to: "" },
    comment: { enabled: false, from: "", to: "" },
    courses: { enabled: false, from: "", to: "" }
  });

  useEffect(() => {
    const fetchAutoApprove = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/auto_approve/", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setAutoApprove(data);
        } else {
          console.error("❌ Không fetch được auto-approve. Status:", res.status);
        }
      } catch (err) {
        console.error("❌ Lỗi mạng khi gọi auto-approve:", err);
      }
    };
    fetchAutoApprove();
  }, []);

  const handleSaveAutoApproveConfig = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/auto_approve/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoApprove })
      });

      if (response.ok) {
        alert('✅ Đã lưu cấu hình duyệt tự động.');
      } else {
        const errorData = await response.json();
        alert(`❌ Lỗi: ${errorData.error || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Có lỗi mạng.');
    }
  };

  // ----------------- Permissions (cải tiến) ----------------- //
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissionKey, setSelectedPermissionKey] = useState("");
  const [permission, setPermission] = useState({ description: "", min_reputation: 0 });

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/admin_reputationpermission/")
      .then((res) => res.ok ? res.json() : Promise.reject("Error fetching permissions"))
      .then((data) => setAvailablePermissions(data))
      .catch((err) => console.error(err));
  }, []);

  const handlePermissionSelect = (e) => {
    const key = e.target.value;
    setSelectedPermissionKey(key);
    const found = availablePermissions.find((p) => p.action_key === key);
    if (found) {
      setPermission({ description: found.description, min_reputation: found.min_reputation || 0 });
    }
  };
  const handlePermissionPointChange = (e) => setPermission((prev) => ({ ...prev, min_reputation: parseInt(e.target.value) }));

  const handlePermissionSave = async () => {
    const token = getToken();
    const payload = { action_key: selectedPermissionKey, ...permission };
    try {
      const response = await fetch("http://localhost:8000/api/admin/admin_reputationpermission/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('✅ Cập nhật phân quyền thành công!');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`❌ Lỗi: ${errorData.error || 'Không rõ'}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Có lỗi xảy ra.');
    }
  };

  // ----------------- Reputation Rules ----------------- //
  const [availableRules, setAvailableRules] = useState([]);
  const [selectedRuleKey, setSelectedRuleKey] = useState("");
  const [reputationRule, setReputationRule] = useState({ description: "", point_change: 0 });

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/admin_reputationlist/")
      .then((res) => res.ok ? res.json() : Promise.reject("Error fetching reputation list"))
      .then((data) => setAvailableRules(data))
      .catch((err) => console.error(err));
  }, []);

  const handleRuleSelect = (e) => {
    const key = e.target.value;
    setSelectedRuleKey(key);
    const found = availableRules.find((r) => r.rule_key === key);
    if (found) setReputationRule({ description: found.description, point_change: found.point_change || 0 });
  };
  const handlePointChange = (e) => setReputationRule((prev) => ({ ...prev, point_change: parseInt(e.target.value) }));
  const handleSave = async () => {
    const token = getToken();
    const payload = { rule_key: selectedRuleKey, ...reputationRule };
    try {
      const response = await fetch("http://localhost:8000/api/admin/admin_reputationlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('✅ Cập nhật thành công!');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`❌ Lỗi: ${errorData.message || 'Không rõ'}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Có lỗi xảy ra.');
    }
  };

  // ----------------- JSX ----------------- //
  return (
    <div style={styles.pageWrapper}>
      {/* Permissions Section */}
      <div style={styles.section}>
        <h3 style={{ fontWeight: "bold" }}>Phân quyền theo điểm uy tín</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Hành động:</label>
          <select value={selectedPermissionKey} onChange={handlePermissionSelect} style={styles.input}>
            <option value="">-- Chọn hành động --</option>
            {availablePermissions.map((perm) => (
              <option key={perm.action_key} value={perm.action_key}>{perm.action_key}</option>
            ))}
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mô tả:</label>
          <input value={permission.description} readOnly style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Điểm uy tín tối thiểu:</label>
          <input value={permission.min_reputation} onChange={handlePermissionPointChange} style={styles.input} type="number" />
        </div>
        <button onClick={handlePermissionSave} style={styles.button}>Cập nhật</button>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Hành động</th>
              <th style={styles.tableHeader}>Mô tả</th>
              <th style={styles.tableHeader}>Điểm tối thiểu</th>
            </tr>
          </thead>
          <tbody>
            {availablePermissions.map((perm, index) => (
              <tr key={index} style={{ cursor: "pointer" }} onClick={() => { setSelectedPermissionKey(perm.action_key); setPermission({ description: perm.description, min_reputation: perm.min_reputation }); }}>
                <td style={styles.tableCell}>{perm.action_key}</td>
                <td style={styles.tableCell}>{perm.description}</td>
                <td style={styles.tableCell}>{perm.min_reputation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reputation Rules Section */}
      <div style={styles.section}>
        <h3 style={{ fontWeight: "bold" }}>Quy tắc tính điểm uy tín</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quy tắc:</label>
          <select value={selectedRuleKey} onChange={handleRuleSelect} style={styles.input}>
            <option value="">-- Chọn quy tắc --</option>
            {availableRules.map((r) => <option key={r.rule_key} value={r.rule_key}>{r.rule_key}</option>)}
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mô tả:</label>
          <input value={reputationRule.description} readOnly style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Thay đổi điểm:</label>
          <input value={reputationRule.point_change} onChange={handlePointChange} style={styles.input} type="number" />
        </div>
        <button onClick={handleSave} style={styles.button}>Cập nhật</button>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Quy tắc</th>
              <th style={styles.tableHeader}>Mô tả</th>
              <th style={styles.tableHeader}>Điểm thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {availableRules.map((r, index) => (
              <tr key={index}><td style={styles.tableCell}>{r.rule_key}</td><td style={styles.tableCell}>{r.description}</td><td style={styles.tableCell}>{r.point_change}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auto Approve Section */}
      <div style={styles.section}>
        <h3 style={{ fontWeight: "bold" }}>Cấu hình hệ thống tự động duyệt</h3>
        {["question", "answer", "comment", "courses"].map((type) => (
          <div key={type} style={styles.autoConfigRow}>
            <label style={styles.label}>{type === "question" ? "Câu hỏi" : type === "answer" ? "Câu trả lời" : type === "comment" ? "Bình luận" : "Khóa học"}</label>
            <div onClick={() => setAutoApprove((prev) => ({ ...prev, [type]: { ...prev[type], enabled: !prev[type].enabled } }))} style={{ ...styles.switch, backgroundColor: autoApprove[type].enabled ? "#4caf50" : "#f44336" }}>
              <div style={{ ...styles.switchCircle, transform: autoApprove[type].enabled ? "translateX(26px)" : "translateX(2px)" }} />
            </div>
            <div style={styles.dateInline}>
              <input type="date" value={autoApprove[type].from} onChange={(e) => setAutoApprove((prev) => ({ ...prev, [type]: { ...prev[type], from: e.target.value } }))} style={styles.input} />
              <span style={{ margin: "0 5px" }}>→</span>
              <input type="date" value={autoApprove[type].to} onChange={(e) => setAutoApprove((prev) => ({ ...prev, [type]: { ...prev[type], to: e.target.value } }))} style={styles.input} />
            </div>
          </div>
        ))}
        <button onClick={handleSaveAutoApproveConfig} style={styles.button}>Lưu cấu hình</button>
      </div>
    </div>
  );
};

export default AdminManageDetailAccount;

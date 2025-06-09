import React, { useState, useMemo } from "react";

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "-70px",
  width: "850px",
  color: "#003366",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  borderBottom: "2px solid #003366",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#e6f0ff",
  color: "#003366",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
};

const buttonStyle = {
  backgroundColor: "#003366",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600",
};

const filterContainerStyle = {
  marginBottom: "20px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const selectStyle = {
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  color: "#003366",
  fontWeight: "600",
};

const inputStyle = {
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  color: "#003366",
  fontWeight: "600",
};

const AdminManageAccount = () => {
  // Dữ liệu giả lập auth_user
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "nguyenvanA",
      email: "nguyenvanA@example.com",
      role: "Học sinh",
      createdAt: "2023-04-15",
      status: "Active",
    },
    {
      id: 2,
      username: "phamthib",
      email: "phamthib@example.com",
      role: "Giáo viên",
      createdAt: "2023-05-20",
      status: "Inactive",
    },
    {
      id: 3,
      username: "tranminh",
      email: "tranminh@example.com",
      role: "Học sinh",
      createdAt: "2023-06-01",
      status: "Active",
    },
    {
      id: 4,
      username: "lethuhuong",
      email: "lethuhuong@example.com",
      role: "Giáo viên",
      createdAt: "2023-01-10",
      status: "Active",
    },
  ]);

  // State filter
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  // Xử lý filter dữ liệu
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter role
      if (filterRole !== "Tất cả" && user.role !== filterRole) {
        return false;
      }
      // Filter status
      if (filterStatus !== "Tất cả" && user.status !== filterStatus) {
        return false;
      }
      // Filter from date
      if (filterFromDate && new Date(user.createdAt) < new Date(filterFromDate)) {
        return false;
      }
      // Filter to date
      if (filterToDate && new Date(user.createdAt) > new Date(filterToDate)) {
        return false;
      }
      return true;
    });
  }, [users, filterRole, filterStatus, filterFromDate, filterToDate]);

  // Các thao tác admin
  const handleEdit = (id) => {
    alert(`Bạn muốn sửa tài khoản ID: ${id}`);
    // Xử lý sửa ở đây
  };

  const handleDelete = (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản ID: ${id}?`)) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const handleResetPassword = (id) => {
    alert(`Bạn muốn reset mật khẩu cho tài khoản ID: ${id}`);
    // Xử lý reset mật khẩu
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#003366", marginBottom: "15px" }}>Quản lý tài khoản Admin</h2>

      {/* Bộ lọc */}
      <div style={filterContainerStyle}>
        <label>
          Lọc đối tượng:
          <select
            style={selectStyle}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Học sinh</option>
            <option>Giáo viên</option>
          </select>
        </label>

        <label>
          Trạng thái:
          <select
            style={selectStyle}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>

        <label>
          Từ ngày:
          <input
            style={inputStyle}
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
        </label>

        <label>
          Đến ngày:
          <input
            style={inputStyle}
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
        </label>
      </div>

      {/* Bảng */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Tên đăng nhập</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Đối tượng</th>
            <th style={thStyle}>Ngày tạo</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ ...tdStyle, textAlign: "center", fontStyle: "italic" }}>
                Không tìm thấy tài khoản phù hợp
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>{user.createdAt}</td>
                <td style={tdStyle}>{user.status}</td>
                <td style={tdStyle}>
                  <button style={buttonStyle} onClick={() => handleEdit(user.id)}>
                    Sửa
                  </button>
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#cc3333" }}
                    onClick={() => handleDelete(user.id)}
                  >
                    Xóa
                  </button>
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#0066cc" }}
                    onClick={() => handleResetPassword(user.id)}
                  >
                    Reset MK
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageAccount;

import React, { useEffect, useState } from "react";
 import { getToken } from "../auth/authHelper";
const AccountPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("view");
  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }

    fetch("http://localhost:8000/api/admin/admin_update/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        alert("Không thể tải thông tin người dùng.");
      });
  }, []);

  const handleSaveUser = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", parseInt(selectedUser.id, 10));
      formData.append("is_active", selectedUser.is_active);
      formData.append("full_name", selectedUser.full_name || "");
      formData.append("phone", selectedUser.phone || "");
      formData.append("birth_date", selectedUser.birth_date || "");
      formData.append("gender", selectedUser.gender || "");
      formData.append("user_type", selectedUser.user_type || "");
      formData.append("address", selectedUser.address || "");
      formData.append("old_password", oldPassword);
      formData.append("new_password", newPassword);

      if (selectedUser.avatarFile) {
        formData.append("avatar", selectedUser.avatarFile);
      }
      console.log("====== FormData gửi lên ======");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log("====== Hết FormData ======");
      const response = await fetch("http://localhost:8000/api/admin/admin_update/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Lỗi cập nhật người dùng");
      }

      alert("Cập nhật thành công");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "32px",
          width: "100%",
          maxWidth: "900px",
          position: "relative",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>
          Quản lý tài khoản
        </h2>

        <div className="aduserman-form-grid">
          {/* Tên đăng nhập */}
          <div className="aduserman-form-group">
            <label className="aduserman-label">Tên đăng nhập</label>
            <input
              type="text"
              value={selectedUser?.username || ""}
              disabled
              className="aduserman-input"
            />
          </div>

          {/* Mật khẩu cũ */}
          <div className="aduserman-form-group">
            <label className="aduserman-label">Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="aduserman-input"
              placeholder="Nhập mật khẩu cũ"
              disabled={!editMode}
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="aduserman-form-group">
            <label className="aduserman-label">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="aduserman-input"
              placeholder="Nhập mật khẩu mới"
              disabled={!editMode}
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="aduserman-form-group">
            <label className="aduserman-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="aduserman-input"
              placeholder="Nhập lại mật khẩu mới"
              disabled={!editMode}
            />
          </div>

          {/* Avatar upload và preview */}
          <div className="aduserman-form-group">
            {selectedUser?.avatarPreview && (
              <img
                src={selectedUser.avatarPreview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border"
              />
            )}
          </div>

          {/* Checkbox trạng thái hoạt động */}
          <div className="aduserman-form-group aduserman-col-span-2">
            <div className="aduserman-checkbox-group">
              <label className="aduserman-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedUser?.is_active || false}
                  disabled={!editMode}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, is_active: e.target.checked })
                  }
                  className="aduserman-checkbox"
                />
                <span>Tài khoản hoạt động</span>
              </label>
            </div>
          </div>

          {/* Ngày tạo và đăng nhập cuối */}
          <div className="aduserman-form-group">
            <label className="aduserman-label">Lần đăng nhập cuối</label>
            <input
              type="text"
              value={
                selectedUser?.last_login
                  ? new Date(selectedUser.last_login).toLocaleString("vi-VN")
                  : "Chưa từng đăng nhập"
              }
              disabled
              className="aduserman-input"
            />
          </div>

          <div className="aduserman-form-group">
            <label className="aduserman-label">Ngày tạo tài khoản</label>
            <input
              type="text"
              value={
                selectedUser?.date_joined
                  ? new Date(selectedUser.date_joined).toLocaleString("vi-VN")
                  : ""
              }
              disabled
              className="aduserman-input"
            />
          </div>
        </div>

        {/* Button: bottom-right */}
        <div style={{ textAlign: "right", marginTop: "32px" }}>
          {editMode ? (
            <button
              onClick={handleSaveUser}
              style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none" }}
            >
              Cập nhật
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              style={{ backgroundColor: "#4caf50", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none" }}
            >
              Thay đổi thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

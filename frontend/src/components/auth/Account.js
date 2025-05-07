import React from "react";

const AccountPage = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/your-background-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "30px",
        }}
      >
        {/* Account Info */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0", fontSize: "24px", color: "#003366" }}>
            Tài khoản: <b>20216873 - Đỗ Trung Quân</b>
          </h2>
          <p style={{ marginTop: "8px", color: "#555", fontSize: "16px" }}>
            Quản lý thông tin đăng nhập và bảo mật tài khoản của bạn.
          </p>
        </div>

        {/* Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Mật khẩu cũ
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu cũ"
              style={{
                width: "96.5%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="Password"
              style={{
                width: "96.5%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
              Tối thiểu 8 ký tự
            </div>
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Confirm"
              style={{
                width: "96.5%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#0077cc",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;

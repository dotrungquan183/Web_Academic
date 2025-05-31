import React, { useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Đăng nhập thất bại!");
        return;
      }

      if (!data.role || !data.username || !data.avatar) {
        alert("Dữ liệu từ API không hợp lệ!");
        return;
      }

      const avatarUrl =
        data?.avatar && data.avatar.trim() !== ""
          ? data.avatar
          : "/default-avatar.png";

      const userData = {
        username: data.username,
        full_name: data?.full_name || data.username,
        avatar: avatarUrl,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      onLoginSuccess(userData.role);
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "rgba(249, 249, 249, 0.9)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <FaUserGraduate size={28} color="#003366" /> Toán học sinh viên{" "}
          <FaUserGraduate size={28} color="#003366" />
        </h2>

        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Tên đăng nhập:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "94%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "94%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#003366",
              color: "white",
              border: "2px solid #003366",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#003366";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#003366";
              e.target.style.color = "white";
            }}
          >
            <span>Đăng nhập</span>
          </button>
        </form>

        {/* Quên mật khẩu và Đăng ký trên cùng một dòng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            fontWeight: "bold",
          }}
        >
          <Link
            to="/forgotpassword"
            style={{ color: "#003366", textDecoration: "none" }}
          >
            Quên mật khẩu?
          </Link>
          <Link
            to="/register"
            style={{ color: "#003366", textDecoration: "none" }}
          >
            Đăng ký tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
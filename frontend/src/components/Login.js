import React, { useState } from "react";
import { FaUserGraduate, FaArrowRight } from "react-icons/fa"; 
import { Link } from "react-router-dom"; // Import Link để điều hướng

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("DEBUG: API response:", data); // Kiểm tra dữ liệu từ API

        if (!response.ok) {
            alert(data.error || "Đăng nhập thất bại!");
            return;
        }

        if (!data.role || !data.username) {
            alert("Dữ liệu từ API không hợp lệ!");
            return;
        }

        const avatarUrl = data?.avatar && data.avatar.trim() !== "" 
    ? data.avatar 
    : "/default-avatar.png";

        const userData = {
            username: data.username,
            full_name: data?.user_info?.full_name || data.username,
            avatar: avatarUrl,
            role: data.role,
        };

        console.log("DEBUG: userData before saving:", userData); // Kiểm tra dữ liệu trước khi lưu
        localStorage.setItem("user", JSON.stringify(userData)); // Lưu vào localStorage

        console.log("DEBUG: LocalStorage user:", localStorage.getItem("user")); // Kiểm tra sau khi lưu
        onLoginSuccess(userData.role);
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
};
  
   
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ 
          textAlign: "center", 
          textTransform: "uppercase", 
          fontWeight: "bold", 
          marginBottom: "10px",  
          marginTop: "-10px",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "20px"
        }}>
          <FaUserGraduate size={28} color="#003366" />
          Toán học sinh viên
          <FaUserGraduate size={28} color="#003366" />
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Tên đăng nhập:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "93.6%",
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
                width: "93.6%",
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
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#003366";
              e.target.style.border = "2px solid #003366";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#003366";
              e.target.style.color = "white";
              e.target.style.border = "2px solid #003366";
            }}
          >
            <span>Đăng nhập</span>
            <FaArrowRight size={16} style={{ marginLeft: "8px", position: "absolute", right: "15px" }} />
          </button>

        </form>

        {/* Link quên mật khẩu */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/forgotpassword" style={{ color: "#003366", textDecoration: "none", fontWeight: "bold" }}>
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

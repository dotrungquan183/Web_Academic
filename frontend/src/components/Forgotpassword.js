import React, { useState, useEffect } from "react";
import { FaKey, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/forgotpassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setMessage(data.message);
        setCountdown(300); // Đặt bộ đếm ngược 5 phút
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/verify_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(3);
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/resetpassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Mật khẩu đã được đặt lại thành công!");
        setStep(4);
  
       } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
          textAlign: "center",
        }}
      >
        <h2 style={{ textAlign: "center", textTransform: "uppercase", fontWeight: "bold", marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <FaKey /> Quên Mật Khẩu <FaLock />
        </h2>

        {message && <p style={{ color: message.includes("lỗi") ? "red" : "blue" }}>{message}</p>}

        {step === 1 && (
          <form onSubmit={handleForgotPassword}>
            <input type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "94%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }} />
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#003366", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Gửi OTP</button>
          </form>
        )}

        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "blue", fontWeight: "bold", marginBottom: "15px" }}>
              Thời gian hiệu lực còn lại: {countdown > 0 ? formatTime(countdown) : "Hết hạn"}
            </p>

            <form onSubmit={handleVerifyOtp} style={{ width: "100%", margin: "auto" }}>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{
                  width: "95%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px"
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Xác minh OTP
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: "94%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }} />
            <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#003366", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Đặt lại mật khẩu</button>
          </form>
        )}

        {step === 4 && (
          <button onClick={() => navigate("/login")} style={{ width: "94%", padding: "10px", backgroundColor: "#003366", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Quay lại đăng nhập</button>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword ;

import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
    gender: "Nam",
    user_type: "Sinh viên",
    address: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        setFormData({ ...formData, avatar: file });
      } else {
        alert("Chỉ chấp nhận file .jpg hoặc .png");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
      }

      // Chuẩn bị FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("birth_date", formData.birth_date);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("user_type", formData.user_type);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      if (formData.avatar) {
          formDataToSend.append("avatar", formData.avatar);  // Thêm file ảnh nếu có
      }

      try {
          const response = await fetch("http://localhost:8000/api/register/", {
              method: "POST",
              body: formDataToSend,
          });

          const result = await response.json();
          if (response.ok) {
              alert(result.message);
          } else {
              alert(`Lỗi: ${result.error}`);
          }
      } catch (error) {
          alert("Có lỗi xảy ra. Vui lòng thử lại!");
      }
  };


  return (
    <div style={outerContainerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>
          <FaUserPlus size={24} color="#003366" /> Đăng Ký
        </h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={sectionContainerStyle}>
            <div style={sectionStyle}>
              <input type="text" name="full_name" placeholder="Họ và tên" required onChange={handleChange} style={inputStyle} />
              <input type="date" name="birth_date" onChange={handleChange} style={inputStyle} />
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={inputStyle} />
              <select name="user_type" value={formData.user_type} onChange={handleChange} style={selectStyle}>
                <option value="Sinh viên">Sinh viên</option>
                <option value="Giảng viên">Giảng viên</option>
              </select>
              <input type="password" name="password" placeholder="Mật khẩu" required onChange={handleChange} style={ inputStyle} />
            </div>
            <div style={sectionStyle}>
              <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} style={inputStyle} />
              <select name="gender" value={formData.gender} onChange={handleChange} style={selectStyle}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input type="text" name="username" placeholder="Tên đăng nhập" required onChange={handleChange} style={inputStyle} />
              <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} style={inputStyle} />
              <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" required onChange={handleChange} style={ inputStyle} />
            </div>
          </div>
          <label style={{ fontWeight: "bold", marginTop: "20px" , color: "#003366"}}> AVATAR</label>
          <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} style={inputStyleAV} />
          
          <button type="submit" style={buttonStyle}>Đăng ký</button>
        </form>
      </div>
    </div>
  );
}

const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f1f1f1",
};

const formContainerStyle = {
  width: "900px",
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
};

const titleStyle = {
  textAlign: "center",
  textTransform: "uppercase",
  fontWeight: "bold",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const sectionContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const sectionStyle = {
  width: "45%",
  backgroundColor: "rgba(200, 200, 200, 0.3)",
  padding: "15px",
  borderRadius: "8px",
};

const inputStyle = {
  width: "95%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
};

const inputStyleAV = {
  width: "97.5%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
  marginBottom:"10px"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#003366",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "uppercase",
  marginTop: "15px",
};

export default Register;
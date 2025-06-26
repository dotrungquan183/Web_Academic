import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
    gender: "Nam",
    user_type: "Học sinh",
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert(`Lỗi: ${result.error}`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>
          <FaUserPlus size={24} color="#003366" /> Đăng Ký
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.sectionContainer}>
            <div style={styles.section}>
              <input type="text" name="full_name" placeholder="Họ và tên" required onChange={handleChange} style={styles.input} />
              <input type="date" name="birth_date" onChange={handleChange} style={styles.input} />
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={styles.input} />
              <select name="user_type" value={formData.user_type} onChange={handleChange} style={styles.select}>
                <option value="Học sinh">Học sinh</option>
                <option value="Giáo viên">Giáo viên</option>
              </select>
              <input type="password" name="password" placeholder="Mật khẩu" required onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.section}>
              <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} style={styles.input} />
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input type="text" name="username" placeholder="Tên đăng nhập" required onChange={handleChange} style={styles.input} />
              <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} style={styles.input} />
              <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" required onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <label style={{ fontWeight: "bold", marginTop: "20px", color: "#003366" }}>AVATAR</label>
          <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} style={styles.input} />
          <button type="submit" style={styles.button}>Đăng ký</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('https://images.pexels.com/photos/300857/pexels-photo-300857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formContainer: {
    width: "900px",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  section: {
    width: "45%",
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "15px",
    borderRadius: "8px",
  },
  input: {
    width: "95%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  button: {
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
  },
};

export default Register;

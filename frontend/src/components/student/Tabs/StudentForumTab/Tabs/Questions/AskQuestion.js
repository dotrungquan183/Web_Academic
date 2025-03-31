import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function StudentAskQuestion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags } = formData;
    if (!title || !description || !tags) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/questions", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Câu hỏi đã được đăng!");
        navigate("/questions");
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
          <FaQuestionCircle size={24} color="#003366" /> Đặt Câu Hỏi
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.sectionContainer}>
            <div style={styles.leftSection}>
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề câu hỏi"
                required
                onChange={handleChange}
                style={styles.input}
              />
              <textarea
                name="description"
                placeholder="Mô tả câu hỏi"
                required
                onChange={handleChange}
                style={styles.textarea}
              />
              <input
                type="text"
                name="tags"
                placeholder="Thẻ (cách nhau bằng dấu phẩy)"
                required
                onChange={handleChange}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Đăng câu hỏi
              </button>
            </div>
            <div style={styles.rightSection}>
              <h3 style={styles.stepTitle}>Hướng dẫn đặt câu hỏi đúng chuẩn</h3>
              <ul style={styles.stepList}>
                <li>1. Tiêu đề phải ngắn gọn và dễ hiểu.</li>
                <li>2. Mô tả câu hỏi chi tiết, cụ thể và không mơ hồ.</li>
                <li>3. Sử dụng các thẻ phù hợp, cách nhau bằng dấu phẩy.</li>
                <li>4. Đảm bảo câu hỏi có đầy đủ thông tin cần thiết cho người trả lời.</li>
                <li>5. Nếu có lỗi hoặc vấn đề cụ thể, hãy mô tả rõ ràng.</li>
              </ul>
            </div>
          </div>
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
    height: "77vh",
  },
  formContainer: {
    width: "1000px",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#003366",
    marginTop: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  leftSection: {
    width: "48%",
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "20px",
    borderRadius: "8px",
  },
  rightSection: {
    width: "48%",
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "0",
  },
  input: {
    width: "94.5%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "12px",
  },
  textarea: {
    width: "94.5%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "12px",
    minHeight: "120px",
  },
  button: {
    width: "100%",
    padding: "12px",
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
  stepTitle: {
    fontWeight: "bold",
    color: "#003366",
    marginBottom: "12px",
  },
  stepList: {
    paddingLeft: "20px",
    color: "#333",
  },
};

export default StudentAskQuestion;

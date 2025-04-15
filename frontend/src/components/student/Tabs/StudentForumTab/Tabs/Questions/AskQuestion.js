import React, { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // 🔥 dùng useLocation
import StudentForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";

function StudentAskQuestion() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ lấy state từ navigate
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    bounty_amount: 0,
  });

  // Nếu có token thì cho vào, không thì điều hướng sang login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Nếu có dữ liệu từ state thì fill vào form
  useEffect(() => {
    if (location.state?.question) {
      const q = location.state.question;
      setFormData({
        title: q.title || "",
        description: q.content || "", // dùng q.content nếu field cũ là content
        tags: q.tags?.join(", ") || "", // nếu là array thì join lại
        bounty_amount: q.bounty_amount || 0,
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bounty_amount" && (isNaN(value) || Number(value) < 0)) {
      alert("Giá trị treo thưởng không hợp lệ!");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags, bounty_amount } = formData;
  
    if (!title || !description || !tags) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
  
    const questionData = {
      title,
      content: description, // API có thể dùng "content" thay vì "description"
      tags: tags.split(",").map((tag) => tag.trim()),
      bounty_amount: Number(bounty_amount),
    };
  
    const isEditing = !!location.state?.question;
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `http://localhost:8000/api/student/student_forum/student_question/${location.state.question.id}/`
      : "http://localhost:8000/api/student/student_forum/student_question/student_askquestion/";
  
    try {
      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify(questionData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(isEditing ? "Cập nhật câu hỏi thành công!" : "Câu hỏi đã được đăng!");
        navigate("/studentforum/question");
      } else {
        alert(`Lỗi: ${result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error(error);
    }
  };  

  return (
    <StudentForumLayout>
      <div style={styles.outerContainer}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>
            <FaQuestionCircle size={24} color="#003366" />{" "}
            {location.state?.question ? "Chỉnh sửa câu hỏi" : "Đặt Câu Hỏi"}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.sectionContainer}>
              <div style={styles.leftSection}>
                <input
                  type="text"
                  name="title"
                  placeholder="Tiêu đề câu hỏi"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                />
                <textarea
                  name="description"
                  placeholder="Mô tả câu hỏi"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                />
                <input
                  type="text"
                  name="tags"
                  placeholder="Thẻ (cách nhau bằng dấu phẩy)"
                  required
                  value={formData.tags}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  type="number"
                  name="bounty_amount"
                  placeholder="Treo thưởng (VND)"
                  value={formData.bounty_amount}
                  onChange={handleChange}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>
                  {location.state?.question ? "Cập nhật câu hỏi" : "Đăng câu hỏi"}
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
    </StudentForumLayout>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0", // Thay vì 85vh, dùng padding cho hiển thị tốt hơn với sidebar
    marginLeft:"108px",
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
    marginTop: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  leftSection: {
    flex: "1 1 48%",
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "20px",
    borderRadius: "8px",
  },
  rightSection: {
    flex: "1 1 48%",
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "20px",
    borderRadius: "8px",
  },
  input: {
    width: "97.5%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "12px",
  },
  textarea: {
    width: "97.5%",
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

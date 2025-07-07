import React, { useState, useEffect, useRef } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TeacherForumLayout from "../../TeacherLayout";
import { getToken } from "../../../../../auth/authHelper";
import MathInput from "../../../../../MathInput";
import { MathfieldElement } from 'mathlive';

function TeacherAskQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedPermissionRef = useRef(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    bounty_amount: 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = getToken();
    if (location.state?.question && token && !hasCheckedPermissionRef.current) {
      hasCheckedPermissionRef.current = true;
      const decoded = jwtDecode(token);
      const currentUserId = decoded.user_id || decoded.id || decoded.sub;
      const q = location.state.question;

      if (q.user_id && q.user_id !== currentUserId) {
        alert("Bạn không có quyền chỉnh sửa câu hỏi này!");
        navigate("/teacherforum/question");
        return;
      }

      setFormData({
        title: q.title || "",
        description: q.content || "",
        tags: q.tags?.join(", ") || "",
        bounty_amount: q.bounty_amount || 0,
      });
    }
  }, [location.state, navigate]);

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bounty_amount" && (isNaN(value) || Number(value) < 0)) {
      alert("Giá trị treo thưởng không hợp lệ!");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, tags, bounty_amount } = formData;

    const editorDiv = document.querySelector('[contenteditable="true"]');
    if (!editorDiv) {
      alert("Không tìm thấy nội dung mô tả!");
      return;
    }

    const clone = editorDiv.cloneNode(true);

    // Thay thế math-field bằng LaTeX
    const mathFields = clone.querySelectorAll("math-field");
    mathFields.forEach((mf) => {
      let latex = "";
      try {
        latex = mf.getValue ? mf.getValue() : (mf instanceof MathfieldElement && mf.getValue());
      } catch (err) {
        latex = mf.getAttribute("value") || "";
      }

      if (!latex.trim()) {
        mf.remove();
        return;
      }

      const textNode = document.createTextNode(`$${latex}$`);
      mf.replaceWith(textNode);
    });

    // Loại bỏ các <span> rác chứa &nbsp;
    clone.querySelectorAll("span").forEach((span) => {
      if (span.textContent.trim() === "\u00A0" || span.innerHTML.trim() === "&nbsp;") {
        span.remove();
      }
    });

    const description = clone.innerHTML;

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

    const tagArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const isEditing = !!location.state?.question;

    const endpoint = isEditing
      ? `http://localhost:8000/api/student/student_forum/student_question/${location.state.question.id}/`
      : "http://localhost:8000/api/student/student_forum/student_question/student_askquestion/";

    const payload = new FormData();
    payload.append("title", title);
    payload.append("content", description);
    payload.append("tags", JSON.stringify(tagArray));
    payload.append("bounty_amount", bounty_amount);

    if (isEditing) payload.append("_method", "PUT");
    if (selectedFile) payload.append("attachment", selectedFile);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const result = await response.json();

      if (response.ok) {
        alert(isEditing ? "✅ Cập nhật câu hỏi thành công!" : "✅ Câu hỏi đã được đăng!");
        navigate("/teacherforum/question");
      } else {
        console.error("❌ Lỗi từ backend:", result);
        alert(`Lỗi: ${result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("❌ Lỗi fetch:", error);
      alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };



  return (
    <TeacherForumLayout>
      <div style={styles.outerContainer}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>
            <FaQuestionCircle size={24} color="#003366" /> {location.state?.question ? "Chỉnh sửa câu hỏi" : "Đặt Câu Hỏi"}
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
                <MathInput
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Mô tả câu hỏi (hỗ trợ LaTeX)"
                  style={{ width: "100%", minHeight: 120, maxHeight: 120, overflowY: "auto" }}
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
                  placeholder="Treo thưởng (điểm uy tín)"
                  value={formData.bounty_amount}
                  onChange={handleChange}
                  style={styles.input}
                />
                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <label
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "#333",
                      fontWeight: "500",
                    }}
                  >📎 Đính kèm file</label>

                  {selectedFile && (
                    <div style={{ marginTop: "10px" }}>
                      {selectedFile.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          style={{ marginTop: "8px", maxHeight: "200px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                      ) : (
                        <div style={{ marginTop: "8px", color: "#555" }}>
                          Đã chọn: <strong>{selectedFile.name}</strong><br />
                          <a
                            href={URL.createObjectURL(selectedFile)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-block",
                              marginTop: "6px",
                              padding: "6px 12px",
                              backgroundColor: "#eaeaea",
                              borderRadius: "4px",
                              textDecoration: "none",
                              color: "#0077cc",
                              border: "1px solid #ccc",
                            }}
                          >🔍 Xem file</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button type="submit" style={styles.button}>
                  {location?.state?.question ? "Cập nhật câu hỏi" : "Đăng câu hỏi"}
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
    </TeacherForumLayout>
  );
}


const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0", // Thay vì 85vh, dùng padding cho hiển thị tốt hơn với sidebar
    marginLeft: "108px",
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
    maxWidth: "100%",         // đảm bảo max width
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    padding: "20px",
    borderRadius: "8px",
    boxSizing: "border-box", // phòng lỗi padding làm tràn
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

export default TeacherAskQuestion;

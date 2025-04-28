import React, { useState, useEffect, useRef } from "react";
import { FaBook, FaPlus, FaVideo, FaFileAlt, FaClipboardList, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TeacherCoursesLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";

function TeacherAddCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedPermissionRef = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    price: "",
    courseImage: null,
    introVideo: null,
    qr_code: null,  // 🆕 Thêm dòng này
  });

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = getToken();
    if (location.state?.course && token && !hasCheckedPermissionRef.current) {
      hasCheckedPermissionRef.current = true;
      const decoded = jwtDecode(token);
      const currentUserId = decoded.user_id || decoded.id || decoded.sub;
      const course = location.state.course;
      if (course.teacher_id && course.teacher_id !== currentUserId) {
        alert("Bạn không có quyền chỉnh sửa khóa học này!");
        navigate("/teachercourses/listcourses");
        return;
      }

      setFormData({
        title: course.title || "",
        description: course.description || "",
        tags: course.tags?.join(", ") || "",
        price: course.price || 0,
        courseImage: course.courseImage || null,
        introVideo: course.introVideo || null,
        qr_code: course.qr_code || null, // 🆕 Thêm dòng này
      });
      setChapters(course.chapters || []);
    }
  }, [location.state, navigate]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "courseImage" || name === "introVideo" || name === "qr_code") {  // 🛠️ Sửa đúng field
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "price") {
      const numericValue = Number(value);
      if (numericValue >= 0) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setFormData((prevData) => ({
        ...prevData,
        price: value,
      }));
    }
  };

  const addChapter = () => {
    setChapters([...chapters, { title: "", lessons: [] }]);
  };

  const deleteChapter = (chapterIndex) => {
    const updated = chapters.filter((_, index) => index !== chapterIndex);
    setChapters(updated);
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  const addLesson = (chapterIndex) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons.push({
      title: "",
      video: null,
      document_link: null,
      exercise: null,
    });
    setChapters(updated);
  };

  const deleteLesson = (chapterIndex, lessonIndex) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons = updated[chapterIndex].lessons.filter((_, index) => index !== lessonIndex);
    setChapters(updated);
  };

  const handleLessonChange = (chapterIndex, lessonIndex, field, value) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("price", formData.price);
  
    if (formData.courseImage) {
      formDataToSend.append("courseImage", formData.courseImage);
    }
    if (formData.introVideo) {
      formDataToSend.append("introVideo", formData.introVideo);
    }
    if (formData.qr_code) {
      formDataToSend.append("qr_code", formData.qr_code);
    }
  
    // Tạo chapters và lessons để gửi lên
    const chaptersWithoutFiles = chapters.map((chapter, chapterIndex) => {
      const lessons = chapter.lessons.map((lesson, lessonIndex) => {
        const lessonData = {
          title: lesson.title || "",
          video: lesson.video ? `lesson_video_${chapterIndex}_${lessonIndex}` : null,
          document_link: lesson.document_link ? `lesson_document_link_${chapterIndex}_${lessonIndex}` : null,
          exercise: lesson.exercise || null,
        };
        return lessonData;
      });
      return {
        title: chapter.title || "",
        lessons,
      };
    });
  
    // Gửi bản chapters không chứa file
    formDataToSend.append("chapters", JSON.stringify(chaptersWithoutFiles));
  
    // Upload các file video và tài liệu của các bài học
    chapters.forEach((chapter, chapterIndex) => {
      chapter.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.video) {
          formDataToSend.append(`lesson_video_${chapterIndex}_${lessonIndex}`, lesson.video);
        }
        if (lesson.document_link) {
          formDataToSend.append(`lesson_document_link_${chapterIndex}_${lessonIndex}`, lesson.document_link);
        }
      });
    });
  
    // Log dữ liệu gửi lên để kiểm tra
    console.log("--- FORM DATA GỬI LÊN SERVER ---");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0]+ ':', pair[1]);
    }
    console.log("--- END FORM DATA ---");
  
    // Kiểm tra xem đây có phải là yêu cầu sửa khóa học không
    const isEditing = !!location.state?.course;
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `http://localhost:8000/api/teacher/courses/${location.state.course.id}/`
      : "http://localhost:8000/api/teacher/teacher_courses/teacher_addcourses/";
  
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
        credentials: 'omit',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(isEditing ? "Cập nhật khóa học thành công!" : "Thêm khóa học mới thành công!");
        navigate("/teachercourses/listcourses");
      } else {
        console.error("Lỗi chi tiết:", result);
        alert(`Lỗi: ${result.detail || result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("Lỗi ngoại lệ:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };  
  return (
    <TeacherCoursesLayout>
      <div style={styles.outerContainer}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>
            <FaBook size={24} color="#003366" /> {location.state?.course ? "Chỉnh sửa Khóa học" : "THÊM KHÓA HỌC"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.sectionContainer}>
              <div style={styles.leftSection}>
                <input
                  type="text"
                  name="title"
                  placeholder="Tiêu đề khóa học"
                  required
                  value={formData.title}
                  onChange={handleFormChange}
                  style={styles.input}
                />
                <textarea
                  name="description"
                  placeholder="Mô tả khóa học"
                  required
                  value={formData.description}
                  onChange={handleFormChange}
                  style={styles.textarea}
                />
                <input
                  type="text"
                  name="tags"
                  placeholder="Từ khóa (cách nhau bằng dấu phẩy)"
                  value={formData.tags}
                  onChange={handleFormChange}
                  style={styles.input}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Giá khóa học (VND)"
                  value={formData.price}
                  onChange={handlePriceChange}
                  min="0"  // <-- Cái này tự chặn không cho nhập số âm
                  style={styles.input}
                />

                {formData.price > 0 && (
                  <div style={styles.inputGroup}>
                    <label htmlFor="qr_code" style={{ fontWeight: "bold", color: "#003366" }}>
                      Ảnh QR thanh toán:
                    </label>
                    <input
                      type="file"
                      name="qr_code"        // <--- đổi từ "qrImage" thành "qr_code"
                      id="qr_code"
                      accept="image/*"
                      onChange={handleFormChange}
                      style={styles.input}
                    />
                  </div>
                )}

              </div>

              <div style={styles.rightSection}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ảnh giới thiệu: &nbsp; </label>
                  <input
                    type="file"
                    name="courseImage"
                    accept="image/*"
                    onChange={handleFormChange}
                    style={styles.input2}
                  />
                </div>
                
                <div style={styles.inputGroup}>
                <label style={styles.label}>Video giới thiệu:</label>
                  <input
                    type="file"
                    name="introVideo"
                    accept="video/*"
                    onChange={handleFormChange}
                    style={styles.input2}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tổng số bài học:</label>
                  <input
                    type="text"
                    name="totalLessons"
                    onChange={handleFormChange}
                    style={styles.input2}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Thời lượng: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                  <input
                    type="text"
                    name="courseDuration"
                    onChange={handleFormChange}
                    style={styles.input2}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Trình độ: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</label>
                  <select
                    name="courseLevel"
                    onChange={handleFormChange}
                    style={{ 
                      color: "#003366",  // chỉnh màu chữ của option
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="basic">Cơ bản</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                  </select>

                </div>
              </div>

            </div>

            <hr style={{ margin: "20px 0" }} />

            <div>
              <h3 style={styles.stepTitle}>Chương trình giảng dạy</h3>
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} style={styles.chapter}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="Tiêu đề chương"
                      value={chapter.title}
                      onChange={(e) => handleChapterChange(chapterIndex, "title", e.target.value)}
                      style={styles.input}
                    />
                    <FaEdit style={{ cursor: "pointer", color: "#003366"}} />
                    <FaTrash style={{ cursor: "pointer", color: "#003366" }} onClick={() => deleteChapter(chapterIndex)} />
                  </div>

                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} style={styles.lesson}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="Tiêu đề bài học"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "title", e.target.value)}
                          style={styles.input}
                        />
                        <FaEdit style={{ cursor: "pointer", color: "#003366" }} />
                        <FaTrash
                          style={{ cursor: "pointer", color: "#003366" }}
                          onClick={() => deleteLesson(chapterIndex, lessonIndex)}
                        />
                      </div>

                      <div style={styles.lessonButtonGroup}>
                        <label><FaVideo /> Video bài giảng:</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "video", e.target.files[0])}
                          style={styles.input3}
                        />
                        <label><FaFileAlt /> Tài liệu bài học:</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "document_link", e.target.files[0])}
                          style={styles.input3}
                        />
                        <label><FaClipboardList /> Bài tập:</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "exercise", e.target.files[0])}
                          style={styles.input3}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addLesson(chapterIndex)} style={styles.addButton}>
                    <FaPlus /> Thêm Bài học
                  </button>
                </div>
              ))}

              <button type="button" onClick={addChapter} style={styles.addButton}>
                <FaPlus /> Thêm Chương
              </button>
            </div>

            <button type="submit" style={styles.button}>
              {location.state?.course ? "Cập nhật Khóa học" : "Thêm khóa học"}
            </button>
          </form>
        </div>
      </div>
    </TeacherCoursesLayout>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "15px 0",
    marginLeft: "108px",
  },
  formContainer: {
    width: "1000px",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftSection: {
    width: "48%",
  },
  rightSection: {
    width: "48%",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#003366",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  input2: {
    width: "auto",  // Để input không chiếm hết chiều rộng, thay vì 100%
    padding: "10px",  // Giữ padding như cũ
    marginBottom: "10px",  // Khoảng cách dưới mỗi input (có thể điều chỉnh nếu cần)
    borderRadius: "5px",  // Bo góc cho input
    border: "1px solid #ccc",  // Viền input
    marginLeft: "10px",  // Khoảng cách giữa label và input (cho line-horizontal)
  },
  input3: {
    width: "97.5%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#003366",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  addButton: {
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#003366",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  stepTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    marginTop: "20px",
    color: "#003366",
  },
  chapter: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
  },
  lesson: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
  },
  lessonButtonGroup: {
    marginTop: "10px",
  },
  inputGroup: {
    display: "block",  // Để các thành phần trong group nằm trên cùng một dòng
    alignItems: "center",  // Canh chỉnh cho label và input nằm cùng một chiều cao
    marginBottom: "6px",  // Khoảng cách giữa các inputGroup (nếu cần)
  },
  label: {
    color: "#003366", // Màu chữ xanh đậm
    fontWeight: "bold",
    // các style khác nếu cần
  }
};

export default TeacherAddCourses;

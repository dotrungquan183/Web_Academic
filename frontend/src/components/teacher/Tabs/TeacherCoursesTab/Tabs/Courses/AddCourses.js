import React, { useState, useEffect, useRef } from "react";
import { FaBook, FaPlus, FaFileImage, FaVideo, FaFileAlt, FaClipboardList } from "react-icons/fa";
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
    price: 0,
    courseImage: null,
    introVideo: null,
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
      });
      setChapters(course.chapters || []);
    }
  }, [location.state, navigate]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "courseImage" || name === "introVideo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addChapter = () => {
    setChapters([...chapters, { title: "", lessons: [] }]);
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
      material: null,
      exercise: null,
    });
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
    formDataToSend.append("chapters", JSON.stringify(chapters));

    const isEditing = !!location.state?.course;
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `http://localhost:8000/api/teacher/courses/${location.state.course.id}/`
      : "http://localhost:8000/api/teacher/courses/create/";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert(isEditing ? "Cập nhật khóa học thành công!" : "Thêm khóa học mới thành công!");
        navigate("/teachercourses/listcourses");
      } else {
        alert(`Lỗi: ${result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error(error);
    }
  };

  return (
    <TeacherCoursesLayout>
      <div style={styles.outerContainer}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>
            <FaBook size={24} color="#003366" />{" "}
            {location.state?.course ? "Chỉnh sửa Khóa học" : "Thêm Khóa học"}
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
                  onChange={handleFormChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.rightSection}>
                <h3 style={styles.stepTitle}>Tài liệu khóa học</h3>
                <div>
                  <label>Ảnh khóa học:</label>
                  <input
                    type="file"
                    name="courseImage"
                    accept="image/*"
                    onChange={handleFormChange}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label>Video giới thiệu:</label>
                  <input
                    type="file"
                    name="introVideo"
                    accept="video/*"
                    onChange={handleFormChange}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            <hr style={{ margin: "20px 0" }} />

            <div>
              <h3 style={styles.stepTitle}>Chương trình giảng dạy</h3>
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} style={styles.chapter}>
                  <input
                    type="text"
                    placeholder="Tiêu đề chương"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(chapterIndex, "title", e.target.value)}
                    style={styles.input}
                  />
                  <button type="button" onClick={() => addLesson(chapterIndex)} style={styles.addButton}>
                    <FaPlus /> Thêm Bài học
                  </button>

                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} style={styles.lesson}>
                      <input
                        type="text"
                        placeholder="Tiêu đề bài học"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "title", e.target.value)}
                        style={styles.input}
                      />
                      <div style={styles.lessonButtonGroup}>
                        <label><FaVideo /> Video bài giảng:</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "video", e.target.files[0])}
                          style={styles.input}
                        />
                        <label><FaFileAlt /> Tài liệu bài học:</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "material", e.target.files[0])}
                          style={styles.input}
                        />
                        <label><FaClipboardList /> Bài tập:</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "exercise", e.target.files[0])}
                          style={styles.input}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <button type="button" onClick={addChapter} style={styles.addButton}>
                <FaPlus /> Thêm Chương
              </button>
            </div>

            <button type="submit" style={styles.button}>
              {location.state?.course ? "Cập nhật Khóa học" : "Thêm Khóa học"}
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
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#003366",
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
    marginTop: "20px",
  },
  addButton: {
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  chapter: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f0f8ff",
    borderRadius: "5px",
  },
  lesson: {
    marginTop: "10px",
    backgroundColor: "#e8f0fe",
    padding: "10px",
    borderRadius: "5px",
  },
  lessonButtonGroup: {
    marginTop: "10px",
  },
  stepTitle: {
    fontWeight: "bold",
    color: "#003366",
    marginBottom: "15px",
  },
};

export default TeacherAddCourses;

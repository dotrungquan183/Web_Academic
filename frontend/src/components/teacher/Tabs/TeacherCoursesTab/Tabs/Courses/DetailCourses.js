import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../../../auth/authHelper";
//import TeacherCoursesLayout from "../../Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import StudentListModal from "./StudentListModal";
import {
  FaMoneyBillWave,
  FaClock,
  FaUserTie,
  FaUsers,
  FaBookOpen,
  FaFire,
  FaPlus,
  FaMinus
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
// Lấy userId từ token
import { renderWithLatex } from "../../../TeacherForumTab/TeacherLatexInputKaTeX"; // nếu file khác thì sửa đường dẫn lại
const TeacherDetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [introVideoURL, setIntroVideoURL] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const token = getToken();
  const BASE_URL = "http://localhost:8000";
  const [showReview, setShowReview] = useState(false);

  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (error) {
      console.error("❌ Token không hợp lệ:", error);
    }
  }
  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khóa học này?");
    if (!confirmDelete) return;

    try {
      const token = getToken(); // Lấy token để xác thực
      const response = await fetch(`http://localhost:8000/api/teacher/teacher_courses/teacher_detailcourses/${courseId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("✅ Xóa khóa học thành công!");

        // 👉 Điều hướng đến trang danh sách khóa học
        navigate("/teachercourses/listcourses");

        // Nếu dùng state:
        // setCourses(prev => prev.filter(course => course.id !== courseId));
      } else {
        const errorData = await response.json();
        console.error("❌ Lỗi khi xóa:", errorData);
        alert("❌ Xóa thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi request:", error);
      alert("❌ Đã xảy ra lỗi khi xóa.");
    }
  };
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/teacher/teacher_courses/teacher_detailcourses/${courseId}/`);
        console.log("Dữ liệu khóa học nhận được:", res.data);
        setCourse(res.data);
        setIntroVideoURL(res.data.intro_video); // <-- chỉ cần lấy trực tiếp
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khóa học:", error);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/api/teacher/teacher_courses/teacher_lastestcourses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setLatestCourses(data);
      } catch (error) {
        console.error("Lỗi khi tải khóa học mới nhất:", error);
      }
    };
    fetchLatestCourses();
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/teacher/teacher_courses/teacher_bestcourses/`)
      .then((response) => setHotCourses(response.data))
      .catch((error) => console.error("Lỗi khi tải khóa học nổi bật:", error));
  }, []);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleLessonClick = (lesson) => {
    const videoLink = lesson.video; // Đã là link đầy đủ từ backend
    // Kiểm tra xem video có link hợp lệ hay không
    if (videoLink) {
      setVideoURL((prev) => (prev === videoLink ? "" : videoLink)); // toggle video
    } else {
      console.log("Không có video cho bài học này.");
    }
  };


  if (!course) return <div>Đang tải...</div>;
  console.log("🔐 userId từ token:", userId);
  console.log("📚 userId của khóa học:", course.user);
  return (
    <div style={styles.pageLayout}>
      <div style={styles.containerStyle}>
        <div style={styles.headerWithButton}>
          <h2 style={{ textTransform: "uppercase", margin: 0 }}>{course.title}</h2>

          {/* Nhóm 2 nút ở góc trên bên phải */}
          <div>
            {userId === course.user && (
              <>
                <button
                  style={{ ...styles.editButton, marginRight: "10px", backgroundColor: "#003366" }}
                  onClick={() => handleDelete(course.id)}
                >
                  <FaTrash style={{ marginRight: "6px" }} />
                  Xóa
                </button>

                <button
                  style={styles.editButton}
                  onClick={() =>
                    navigate(`/teachercourses/listcourses/addcourses/${course.id}`, {
                      state: { course },
                    })
                  }
                >
                  <FaEdit style={{ marginRight: "10px" }} />
                  Chỉnh sửa
                </button>
              </>
            )}


            <button
              style={{ ...styles.editButton, marginLeft: "10px" }}
              onClick={() => setModalOpen(true)}
            >
              <FaEdit style={{ marginRight: "6px" }} />
              Danh sách học viên
            </button>

            <StudentListModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </div>

        </div>

        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{course.intro}</p>

        <div style={styles.courseContentWrapper}>
          <div style={styles.videoWrapper}>
            {introVideoURL ? (
              <iframe
                width="100%"
                height="300"
                src={introVideoURL}  // Đảm bảo introVideoURL là link embed từ backend
                title="Giới thiệu khóa học"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <p>Không có video được chọn.</p>
            )}
          </div>

          <div style={styles.courseInfo}>
            <p>{course.description}</p>
            <div style={styles.additionalInfoWrapper}>
              <div style={styles.additionalInfoItem}>
                <FaMoneyBillWave style={styles.iconStyle} />
                <span style={{ fontWeight: "bold" }}>Phí: </span>{course.fee} VNĐ
              </div>
              <div style={styles.additionalInfoItem}>
                <FaClock style={styles.iconStyle} />
                <span style={{ fontWeight: "bold" }}>Thời gian học: </span>{course.total_duration}
              </div>
              <div style={styles.additionalInfoItem}>
                <FaUserTie style={styles.iconStyle} />
                <span style={{ fontWeight: "bold" }}>Giáo viên: </span>{course.teacher}
              </div>
              <div style={styles.additionalInfoItem}>
                <FaUsers style={styles.iconStyle} />
                <span style={{ fontWeight: "bold" }}>Số học viên: </span>{course.student_count}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.containerContent}>
          <h3>Nội dung khóa học</h3>
          {course.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id}>
              <div
                onClick={() => toggleChapter(chapter.id)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  marginTop: "10px"
                }}
              >
                {expandedChapters[chapter.id] ? <FaMinus /> : <FaPlus />}
                <span style={{ marginLeft: "8px" }}>{`${chapterIndex + 1}. ${chapter.title}`}</span>
              </div>

              {expandedChapters[chapter.id] && (
                <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const lessonVideoURL = lesson.video; // Đảm bảo rằng lesson.video đã là URL đầy đủ
                    const isSelected = videoURL === lessonVideoURL;

                    return (
                      <li
                        key={lesson.id}
                        style={{
                          cursor: "default",
                          color: "#1976d2",
                          padding: "5px 0"
                        }}
                      >
                        {/* Tiêu đề bài học */}
                        <div
                          onClick={() => handleLessonClick(lesson)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span>{`${chapterIndex + 1}.${lessonIndex + 1} ${lesson.title}`}</span>
                          <span style={{ fontSize: "14px", color: "#666" }}>{lesson.duration || "--:--"}</span>
                        </div>

                        {/* Nội dung bài học nếu được chọn */}
                        {isSelected && (
                          <div style={{ marginTop: "10px" }}>
                            <iframe
                              key={lessonVideoURL}
                              width="100%"
                              height="400"
                              src={lessonVideoURL}
                              title="Video khóa học"
                              frameBorder="0"
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ width: "100%", borderRadius: "8px" }}
                            >
                              Trình duyệt không hỗ trợ video.
                            </iframe>

                            {/* Tài liệu */}
                            {lesson.document_link && (
                              <div style={{ marginTop: "8px", fontSize: "16px", color: "#003366" }}>
                                📚 Tài liệu:{" "}
                                <a
                                  href={`${BASE_URL}${lesson.document_link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#1d4ed8", textDecoration: "underline" }}
                                >
                                  Xem tài liệu
                                </a>
                              </div>
                            )}

                            {/* Nút xem bài kiểm tra */}
                            {lesson.homeworks?.[0]?.questions?.length > 0 && (
                              <div style={{ marginTop: "10px" }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReview(prev => !prev); // Toggle
                                  }}
                                  style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#1d4ed8",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                  }}
                                >
                                  📄 {showReview ? 'Ẩn bài kiểm tra' : 'Xem bài kiểm tra'}
                                </button>
                              </div>
                            )}

                            {/* Hiển thị bài kiểm tra và đáp án */}
                            {showReview && lesson.homeworks?.[0]?.questions?.map((q, index) => (
                              <div
                                key={q.id}
                                style={{
                                  marginTop: "20px",
                                  border: "1px solid #ccc",
                                  padding: "20px",
                                  borderRadius: "8px",
                                  background: "#f9f9f9"
                                }}
                              >
                                <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
                                  Câu {index + 1}: {renderWithLatex(q.question_text)}
                                </p>

                                {q.choices.map((ans, i) => (
                                  <p key={i}>
                                    <strong>Đáp án {String.fromCharCode(65 + i)}:</strong>{" "}
                                    {renderWithLatex(ans.choice_text)}
                                    {ans.is_correct && (
                                      <span style={{ color: "green", marginLeft: "8px" }}>✓ Đáp án đúng</span>
                                    )}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </li>


                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.sidebarWrapper}>
        <div style={styles.sidebarBox}>
          <h3 style={styles.sidebarTitle}>
            <FaBookOpen style={styles.iconStyle} /> Khóa học mới nhất
          </h3>
          <ul>
            {latestCourses.map((course) => (
              <li
                key={course.id}
                onClick={() => navigate(`/teachercourses/listcourses/${course.id}`)}
                style={{ ...styles.linkStyle, cursor: 'pointer' }}
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.sidebarBox}>
          <h3 style={styles.sidebarTitle}>
            <FaFire style={styles.iconStyle} /> Khóa học nổi bật
          </h3>
          <ul>
            {hotCourses.map((course) => (
              <li
                key={course.id}
                onClick={() => navigate(`/teachercourses/listcourses/${course.id}`)}
                style={{ ...styles.linkStyle, cursor: 'pointer' }}
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    padding: "0 40px",
    alignItems: "flex-start",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "40px",
  },
  containerStyle: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "15px",
    flex: 3,
    color: "#003366",
    boxSizing: "border-box",
  },
  headerWithButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  courseContentWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginBottom: "30px",
  },
  videoWrapper: {
    flex: 2,
  },
  videoStyle: {
    width: "100%",
    maxHeight: "410px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  courseInfo: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  additionalInfoWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  additionalInfoItem: {
    display: "flex",
    alignItems: "center",
  },
  iconStyle: {
    marginRight: "10px",
    color: "#1976d2",
  },
  containerContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sidebarWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "15px", // Dịch xuống 20px
  },

  sidebarBox: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    color: "#003366",
  },
  sidebarTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    fontSize: "18px",
    color: "#003366",
  },
  editButton: {
    padding: "8px 12px",
    backgroundColor: "#003366",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },
};

export default TeacherDetailCourses;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../../../auth/authHelper";

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

const BASE_URL = "http://localhost:8000";

const AdminDetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [introVideoURL, setIntroVideoURL] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const handleApprove = async (courseId) => {
    const confirmPublish = window.confirm("Lưu thay đổi và xuất bản khóa học?");
    if (!confirmPublish) return;

    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_approve: 1 }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("✅ Đã đăng (phê duyệt) khóa học thành công!");
        navigate("/admincourses/listcourses"); // 🔄 Điều hướng sang danh sách
      } else {
        alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
        console.error("Chi tiết lỗi:", result);
      }
    } catch (error) {
      console.error("❌ Có lỗi xảy ra khi phê duyệt khóa học:", error);
      alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };


  const handleReject = async (courseId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn từ chối và xóa khóa học này không?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("✅ Đã từ chối và xóa khóa học!");
        navigate("/admincourses/listcourses");
      } else {
        const result = await response.json();
        alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
        console.error("Chi tiết lỗi:", result);
      }
    } catch (error) {
      console.error("❌ Có lỗi xảy ra:", error);
      alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/admin_courses/admin_detailcourses/${courseId}/`);
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
        const response = await fetch(`${BASE_URL}/api/admin/admin_courses/admin_lastestcourses/`, {
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
      .get(`${BASE_URL}/api/admin/admin_courses/admin_bestcourses/`)
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

  return (
    <div style={styles.pageLayout}>
      <div style={styles.containerStyle}>
        <div style={styles.headerWithButton}>
          <h2 style={{ textTransform: "uppercase", margin: 0 }}>{course.title}</h2>
          <div
            key={course.id}
            style={{
              ...styles.courseCard,
              background: course.id % 2 === 0
                ? "linear-gradient(to right, #0d47a1, #003366)"
                : "white",
              color: course.id % 2 === 0 ? "white" : "#003366",
              cursor: "pointer",
              position: "relative", // cần cho vị trí nút góc
            }}
            onClick={() => navigate(`/teachercourses/listcourses/${course.id}`)}
          >
            {/* Nút duyệt và từ chối */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                display: "flex",
                gap: "6px", // khoảng cách giữa 2 nút
                zIndex: 1,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(course.id);
                }}
                style={{
                  backgroundColor: "green",
                  border: "none",
                  borderRadius: "50%",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title="Duyệt khóa học"
              >
                ✓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(course.id);
                }}
                style={{
                  backgroundColor: "red",
                  border: "none",
                  borderRadius: "50%",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title="Từ chối / Xóa khóa học"
              >
                ✕
              </button>
            </div>
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
                <span style={{ fontWeight: "bold" }}>Phí: </span>${course.fee}
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
                        onClick={() => handleLessonClick(lesson)}
                        style={{
                          cursor: "pointer",
                          color: "#1976d2",
                          padding: "5px 0"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>{`${chapterIndex + 1}.${lessonIndex + 1} ${lesson.title}`}</span>
                          <span style={{ fontSize: "14px", color: "#666" }}>{lesson.duration || "--:--"}</span>
                        </div>

                        {/* Hiển thị video nếu được chọn */}
                        {isSelected && (
                          <div style={{ marginTop: "10px" }}>
                            <iframe
                              key={lessonVideoURL}
                              width="100%"  // Điều chỉnh chiều rộng của iframe
                              height="400"  // Điều chỉnh chiều cao của iframe (có thể thay đổi theo nhu cầu)
                              src={lessonVideoURL}  // Đây là link YouTube embed sẵn
                              title="Video khóa học"  // Thêm thuộc tính title để cải thiện accessibility
                              frameBorder="0"
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{
                                width: "100%",
                                borderRadius: "8px"
                              }}
                            >
                              Trình duyệt không hỗ trợ video.
                            </iframe>


                            {/* Hiển thị tài liệu nếu có */}
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
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)}
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
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)}
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

export default AdminDetailCourses;

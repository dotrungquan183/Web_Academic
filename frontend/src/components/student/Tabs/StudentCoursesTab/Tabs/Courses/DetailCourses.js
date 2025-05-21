import { useState, useEffect} from "react";
import { useParams,  useNavigate  } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../../../auth/authHelper";
import StudentCoursesLayout from "../../Layout";
import { FaEdit } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import Modal from "./Modal";

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

const StudentDetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [introVideoURL, setIntroVideoURL] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentContent, setPaymentContent] = useState("");

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
        const response = await fetch(`${BASE_URL}/api/student/student_courses/student_lastestcourses/`, {
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
    const checkRegistration = async () => {
      const token = localStorage.getItem("token"); // ✅ Đặt trong async function
  
      if (!token) {
        console.warn("Không tìm thấy token.");
        return;
      }
  
      if (!course || !course.id) {
        console.warn("Thông tin khóa học chưa sẵn sàng.");
        return;
      }
  
      try {
        const response = await fetch(
          `${BASE_URL}/api/student/student_courses/student_registrycourses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "omit",
          }
        );
  
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách đăng ký");
        }
  
        const data = await response.json();
        console.log("✅ Danh sách khóa học đã đăng ký:", data);
  
        const isRegisteredCourse = data.registrations?.some((item) => item.course_id === course.id);
        console.log(`✅ Đã đăng ký khóa ${course.id}:`, isRegisteredCourse);
        setIsRegistered(isRegisteredCourse);
      } catch (error) {
        console.error("❌ Lỗi khi kiểm tra đăng ký:", error);
      }
    };
  
    checkRegistration();
  }, [course]); // ✅ Chạy lại khi `course.id` thay đổi
   

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước khi đăng ký.");
      return;
    }
 
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id || decodedToken.id;
 
    try {
      const detailRes = await fetch(
        `${BASE_URL}/api/student/student_courses/student_detailcourses/${course.id}/`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        }
      );
 
      if (!detailRes.ok) {
        throw new Error("Không lấy được thông tin khóa học");
      }
 
      const courseDetail = await detailRes.json();
      const fee = parseFloat(courseDetail.fee);
 
      const registerCourse = async () => {
        const endpoint = `${BASE_URL}/api/student/student_courses/student_registrycourses/${course.id}/`;
 
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        });
 
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Đăng ký thất bại.");
 
        alert(result.message || "Đăng ký thành công!");
        setIsRegistered(true);
        setTimeout(() => window.location.reload(), 1000);
      };
 
      if (fee === 0) {
        // Học phí = 0 -> đăng ký ngay
        await registerCourse();
      } else {
        // Học phí > 0 -> hiển thị thông tin thanh toán
        const paymentNote = `DANGKY_${course.id}_${userId}`;
        setPaymentContent(paymentNote);
        setShowPayment(true);
 
        // Đợi 2 phút trước khi gửi POST
        setTimeout(() => {
          registerCourse().catch((error) => {
            console.error("Lỗi khi đăng ký sau chờ:", error.message);
            alert(error.message || "Đăng ký thất bại sau khi thanh toán.");
          });
        }, 2 * 60 * 1000); // 2 phút
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error.message);
      alert(error.message || "Đăng ký thất bại.");
    }
  };
  
  
  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

const handleLessonClick = async (lesson) => {
  const videoLink = lesson.video;
  const token = getToken();

  if (!videoLink || !token) {
    console.log("Không có video hoặc token.");
    return;
  }

  try {
    jwtDecode(token); // kiểm tra hợp lệ
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return;
  }

  // Kiểm tra xem video này đã mở chưa
  const isOpening = videoURL !== videoLink;

  // Nếu là lần mở mới => ghi log
  if (isOpening) {
    try {
      const response = await fetch("http://localhost:8000/api/student/student_courses/student_viewvideocourses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lesson: lesson.id }),
        credentials: "omit",
      });

      if (!response.ok) throw new Error("Ghi log thất bại");
      const data = await response.json();
      console.log("✅ Đã ghi log xem bài học:", data);
    } catch (error) {
      console.error("❌ Lỗi ghi log xem bài học:", error);
    }
  }

  // Toggle video URL
  setVideoURL(isOpening ? videoLink : "");
};

const handleDocumentView = async (lesson) => {
  const documentLink = lesson.document_link;
  const token = getToken();

  if (!documentLink || !token) {
    console.log("Không có tài liệu hoặc token.");
    return;
  }

  try {
    jwtDecode(token); // kiểm tra token hợp lệ
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/student/student_courses/student_viewdocumentcourses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lesson: lesson.id }),
      credentials: "omit",
    });

    if (!response.ok) throw new Error("Ghi log xem tài liệu thất bại");
    const data = await response.json();
    console.log("✅ Đã ghi log xem tài liệu:", data);
  } catch (error) {
    console.error("❌ Lỗi ghi log xem tài liệu:", error);
  }
};


  if (!course) return <div>Đang tải...</div>;

  return (
    <StudentCoursesLayout>
      <div style={styles.pageLayout}>
        <div style={styles.containerStyle}>
          <div style={styles.headerWithButton}>
            <h2 style={{ textTransform: "uppercase", margin: 0 }}>{course.title}</h2>
            {/* Nút đăng ký chỉ hiển thị nếu chưa đăng ký */}
            {!isRegistered && (
              <button style={styles.editButton} onClick={handleRegister}>
                <FaEdit style={{ marginRight: "6px" }} />
                Đăng ký học
              </button>
            )}
            <Modal isOpen={showPayment} onClose={() => setShowPayment(false)}>
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h3 style={{ color: "#003366" }}>Thông tin thanh toán</h3>
                <img
                  src="http://localhost:8000/image/qr_system.jpg"
                  alt="QR thanh toán"
                  style={{ width: "250px", height: "350px", borderRadius: "8px" }}
                />
                <p style={{ marginTop: "12px", fontWeight: "bold", color: "#003366" }}>
                  Nội dung chuyển khoản: {paymentContent}
                </p>
                <p style={{ marginTop: "12px", fontWeight: "bold", color: "#003366" }}>
                  Học phí : {course.fee} đồng
                </p>
                <p style={{ color: "#ff0000" }}>
                  * Vui lòng chuyển khoản đúng nội dung để hệ thống xác nhận!
                </p>
              </div>
            </Modal>
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
                  <span style={{ fontWeight: "bold" }}>Giáo viên: </span>{course.student}
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

                          {/* Hiển thị video nếu đã đăng ký và bài học đang được chọn */}
                          {isRegistered && isSelected && (
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

                              {lesson.document_link && (
                                <div style={{ marginTop: "8px", fontSize: "16px", color: "#003366" }}>
                                  📚 Tài liệu:{" "}
                                  <a
                                    href={`${BASE_URL}${lesson.document_link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#1d4ed8", textDecoration: "underline" }}
                                    onClick={() => handleDocumentView(lesson)}
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
                  onClick={() => navigate(`/studentcourses/listcourses/${course.id}`)}
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
                  onClick={() => navigate(`/studentcourses/listcourses/${course.id}`)}
                  style={{ ...styles.linkStyle, cursor: 'pointer' }}
                >
                  {course.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudentCoursesLayout>
  );
};

const styles = {
  pageLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginLeft: "160px",
    alignItems: "flex-start",
  },
  containerStyle: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "30px",
    marginLeft: "-70px",
    width: "850px",
    color: "#003366",
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
  },
  sidebarBox: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    color:"#003366",
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

export default StudentDetailCourses;

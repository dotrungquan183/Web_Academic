import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUserIdFromToken} from "../../../../../auth/authHelper";
//import StudentCoursesLayout from "../../Layout";
import { FaEdit } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Modal from "./Modal";
import { renderWithLatex } from "../../../../../teacher/Tabs/TeacherForumTab/TeacherLatexInputKaTeX";
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


const StudentDetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [introVideoURL, setIntroVideoURL] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentContent, setPaymentContent] = useState("");
  const [showHomework, setShowHomework] = useState(false);
  const [timer, setTimer] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: choiceId }
  const BASE_URL = "http://localhost:8000";
  const [submittedHomeworks, setSubmittedHomeworks] = useState([]);
  const currentUserId = getUserIdFromToken(); // gọi 1 lần duy nhất
  const [showReview, setShowReview] = useState(false);
  
  const hasSubmitted = (homeworkId) => {
    return submittedHomeworks.some(
      (sub) => sub.homework_id === homeworkId && sub.student_id === currentUserId
    );
  };

  useEffect(() => {
    const fetchSubmittedHomework = async () => {
      try {
        const token = getToken();
        const response = await fetch("http://localhost:8000/api/student/student_courses/student_homework/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSubmittedHomeworks(data); // lưu danh sách đã nộp bài
      } catch (error) {
        console.error("Lỗi khi fetch submitted homeworks:", error);
      }
    };

    fetchSubmittedHomework();
  }, []);

  const startHomework = (questionCount) => {
    setAnswers({});
    setShowHomework(true);
    setTimer(questionCount * 5 * 60); // 5 phút mỗi câu
  };
  // Hàm xử lý nộp bài (dùng useCallback để tránh cảnh báo của ESLint)
  const handleSubmitHomework = useCallback(async (lesson) => {
    setShowHomework(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập.");
        return;
      }

      const response = await fetch("http://localhost:8000/api/student/student_courses/student_homework/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          homework_id: lesson.homeworks[0].id, // Lấy bài đầu tiên
          answers: answers,                    // { question_id: selected_choice_id }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Nộp bài thành công! Điểm: ${data.score.toFixed(2)}%`);
      } else {
        alert(`❌ Lỗi: ${data.detail || "Không rõ lỗi"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài:", error);
      alert("❌ Gửi bài thất bại, kiểm tra kết nối hoặc thử lại.");
    }
  }, [answers]);


  // Đếm ngược
  useEffect(() => {
    if (!showHomework) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitHomework(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showHomework, handleSubmitHomework]);

  // Định dạng đồng hồ đếm ngược
  const formatCountdown = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Xử lý chọn đáp án
  const handleAnswerChange = (questionId, choiceId, isCheckbox, isChecked) => {
    setAnswers((prev) => {
      const prevAnswer = prev[questionId] || (isCheckbox ? [] : null);

      if (isCheckbox) {
        let updatedChoices = [...prevAnswer];
        if (isChecked) {
          updatedChoices.push(choiceId);
        } else {
          updatedChoices = updatedChoices.filter((id) => id !== choiceId);
        }
        return {
          ...prev,
          [questionId]: updatedChoices,
        };
      } else {
        return {
          ...prev,
          [questionId]: choiceId,
        };
      }
    });
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
    axios
      .get(`${BASE_URL}/api/student/student_courses/student_bestcourses/`)
      .then((response) => setHotCourses(response.data))
      .catch((error) => console.error("Lỗi khi tải khóa học nổi bật:", error));
  }, []);

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
        const paymentNote = `DANGKY ${course.id} ${userId}`;
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
                Học phí : {course.fee} VNĐ
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
                <span style={{ fontWeight: "bold" }}>Phí: </span> {course.fee} VNĐ
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
                        style={{
                          cursor: "default",
                          color: "#1976d2",
                          padding: "5px 0"
                        }}
                      >
                        {/* Chỉ phần tiêu đề mới có onClick mở bài học */}
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

                        {/* Hiển thị nội dung bài học nếu được chọn */}
                        {isRegistered && isSelected && (
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
                                  onClick={() => handleDocumentView(lesson)}
                                >
                                  Xem tài liệu
                                </a>
                              </div>
                            )}

                            {/* Nút bắt đầu làm bài */}
                            {lesson.homeworks?.[0] && (
                              <>
                                {!hasSubmitted(lesson.homeworks[0].id) ? (
                                  <>
                                    {/* Nút làm bài */}
                                    <div style={{ marginTop: "10px" }}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startHomework(lesson.homeworks[0].questions.length);
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
                                        📝 Làm bài kiểm tra
                                      </button>
                                    </div>

                                    {/* Giao diện làm bài */}
                                    {showHomework && (
                                      <div style={{
                                        marginTop: "20px",
                                        border: "1px solid #ccc",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        background: "#f9f9f9"
                                      }}>
                                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#dc2626", marginBottom: "15px" }}>
                                          ⏳ Thời gian còn lại: {formatCountdown(timer)}
                                        </div>

                                        {/* Câu hỏi */}
                                        {lesson.homeworks[0].questions.map((q, index) => (
                                          <div key={q.id} style={{ marginBottom: "25px" }}>
                                            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                                              Câu {index + 1}: {renderWithLatex(q.question_text)}
                                            </p>
                                            {q.choices.map((choice, i) => {
                                              const inputType = q.question_type === "multiple" ? "checkbox" : "radio";
                                              const name = `question-${q.id}`;
                                              return (
                                                <label key={i} style={{ display: "block", marginBottom: "6px" }}>
                                                  <input
                                                    type={inputType}
                                                    name={name}
                                                    value={choice.id}
                                                    checked={
                                                      inputType === "checkbox"
                                                        ? (answers[q.id] || []).includes(choice.id)
                                                        : answers[q.id] === choice.id
                                                    }
                                                    onChange={(e) =>
                                                      handleAnswerChange(q.id, choice.id, inputType === "checkbox", e.target.checked)
                                                    }
                                                    onClick={(e) => e.stopPropagation()}
                                                  />{" "}
                                                  {renderWithLatex(choice.choice_text)}
                                                </label>
                                              );
                                            })}
                                          </div>
                                        ))}

                                        {/* Nút nộp bài */}
                                        <div style={{ textAlign: "right", marginTop: "20px" }}>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSubmitHomework(lesson);
                                            }}
                                            style={{
                                              padding: "10px 20px",
                                              backgroundColor: "#16a34a",
                                              color: "#fff",
                                              border: "none",
                                              borderRadius: "6px",
                                              cursor: "pointer"
                                            }}
                                          >
                                            ✅ Nộp bài
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {/* Nút xem bài kiểm tra nếu đã nộp */}
                                    <div style={{ marginTop: "10px" }}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowReview(prev => !prev);
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

                                    {/* Giao diện xem lại bài kiểm tra */}
                                    {showReview && lesson.homeworks[0].questions.map((q, index) => (
                                      <div key={q.id} style={{
                                        marginTop: "20px",
                                        border: "1px solid #ccc",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        background: "#f9f9f9"
                                      }}>
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
                                  </>
                                )}
                              </>
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

export default StudentDetailCourses;

import React, { useState, useEffect, useRef } from "react";
import { useParams,  useNavigate  } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../../../auth/authHelper";
import TeacherCoursesLayout from "../../Layout";
import { FaEdit } from "react-icons/fa";

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

const TeacherDetailCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [introVideoURL, setIntroVideoURL] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/teacher/teacher_courses/teacher_detailcourses/${courseId}/`);
        console.log("Dữ liệu khóa học nhận được:", res.data); // <-- Dòng này giúp kiểm tra dữ liệu
        setCourse(res.data);
        setIntroVideoURL(`${BASE_URL}${res.data.intro_video}`);
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
    if (lesson.video) {
      const fullURL = `${BASE_URL}${lesson.video}`;
      setVideoURL((prev) => (prev === fullURL ? "" : fullURL)); // toggle video
    }
  };

  if (!course) return <div>Đang tải...</div>;

  return (
    <TeacherCoursesLayout>
      <div style={styles.pageLayout}>
        <div style={styles.containerStyle}>
          <div style={styles.headerWithButton}>
            <h2 style={{ textTransform: "uppercase", margin: 0 }}>{course.title}</h2>
            <button
              style={styles.editButton}
              onClick={() => navigate(`/teachercourses/listcourses/addcourses/${course.id}`, { state: { course } })}
            >
              <FaEdit style={{ marginRight: "6px" }} />
              Chỉnh sửa
            </button>
          </div>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>{course.intro}</p>

          <div style={styles.courseContentWrapper}>
            <div style={styles.videoWrapper}>
              {introVideoURL ? (
                <video
                  ref={videoRef}
                  controls
                  style={styles.videoStyle}
                >
                  <source src={introVideoURL} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
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
                      const lessonVideoURL = `${BASE_URL}${lesson.video}`;
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
                              <video
                                key={lessonVideoURL}
                                controls
                                style={{
                                  width: "100%",
                                  borderRadius: "8px"
                                }}
                              >
                                <source src={lessonVideoURL} type="video/mp4" />
                                Trình duyệt không hỗ trợ video.
                              </video>

                              {/* Hiển thị tài liệu nếu có */}
                              {lesson.document_link && (
                                <div style={{ marginTop: "8px", fontSize: "16px", color: "#003366"}}>
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
    </TeacherCoursesLayout>
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

export default TeacherDetailCourses;

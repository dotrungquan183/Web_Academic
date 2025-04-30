import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TeacherCoursesLayout from "../../Layout";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../../../../auth/authHelper";
import { FaBookOpen, FaFire } from "react-icons/fa";

const TeacherListCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Hàm kiểm tra token người dùng
  const fetchUserFromToken = useCallback(() => {
    const token = getToken();
    if (token) {
      try {
        jwtDecode(token);  // Giải mã token để kiểm tra tính hợp lệ
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserFromToken(); // Kiểm tra token khi component render

    // Hàm lấy danh sách khóa học
    const fetchCourses = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          "http://localhost:8000/api/teacher/teacher_courses/teacher_addcourses/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Truyền token vào header
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data); // Lưu danh sách khóa học vào state
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [fetchUserFromToken]);

  // Lọc khóa học có phí và miễn phí
  const proCourses = courses.filter(course => parseFloat(course.fee) > 0); // Khóa học có phí
  const freeCourses = courses.filter(course => parseFloat(course.fee) === 0); // Khóa học miễn phí

  return (
    <TeacherCoursesLayout>
      <div style={styles.layoutStyle}>
        <div style={styles.containerStyle}>
          <div style={styles.headerWithButton}>
            <h2 style={{ textTransform: "uppercase" }}>DANH SÁCH KHÓA HỌC</h2>
            <button
              style={styles.addButton}
              onClick={() => navigate("/teachercourses/listcourses/addcourses")}
            >
              + Thêm khóa học
            </button>
          </div>

          {/* Hiển thị khóa học có phí */}
          <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>PRO COURSES</h2>
          <div style={styles.gridStyle}>
            {proCourses.length > 0 ? (
              proCourses.map(course => (
                <div
                  key={course.id}
                  style={{
                    ...styles.courseCard,
                    background: course.title.includes("HTML")
                      ? "linear-gradient(to right, #00bcd4, #2196f3)"
                      : course.title.includes("JavaScript")
                      ? "linear-gradient(to right, #ff9800, #ffeb3b)"
                      : "linear-gradient(to right, #e91e63, #f06292)",
                  }}
                >
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.coursePrice}>${course.fee}</p>
                  <p style={styles.courseInfo}>
                    {course.teacher} • {course.students} students • {course.total_duration}
                  </p>
                </div>
              ))
            ) : (
              <p>No paid courses available.</p>
            )}
          </div>

          {/* Hiển thị khóa học miễn phí */}
          <h2 style={{ textAlign: "center", textTransform: "uppercase", marginTop: "20px" }}>FREE COURSES</h2>
          <div style={styles.gridStyle}>
            {freeCourses.length > 0 ? (
              freeCourses.map(course => (
                <div key={course.id} style={styles.freeCourseCard}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.freeCourseInfo}>Free • {course.teacher} • {course.total_duration}</p>
                </div>
              ))
            ) : (
              <p>No free courses available.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebarWrapper}>
          <div style={styles.sidebarStyleRelatedQuestion}>
            <h3 style={styles.sidebarTitle}>
              <FaBookOpen style={styles.iconStyle} />
              Khóa học liên quan
            </h3>
            <ul>
              <li>HTML/CSS cơ bản</li>
              <li>Javascript nâng cao</li>
              <li>Fullstack với MERN</li>
            </ul>
          </div>

          <div style={styles.sidebarStyleHotQuestion}>
            <h3 style={styles.sidebarTitle}>
              <FaFire style={styles.iconStyle} />
              Khóa học nổi bật
            </h3>
            <ul>
              <li>Docker cơ bản</li>
              <li>CI/CD Jenkins</li>
              <li>TypeScript chuyên sâu</li>
            </ul>
          </div>
        </div>
      </div>
    </TeacherCoursesLayout>
  );
};

const styles = {
  layoutStyle: {
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
    marginTop: "15px",
    marginLeft: "-70px",
    width: "850px",
    color: "#003366",
  },
  headerWithButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  addButton: {
    padding: "8px 12px",
    backgroundColor: "#003366",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  sidebarWrapper: {
    width: "260px",
    flexShrink: 0,
  },
  sidebarTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    gap: "8px",
    color: "#003366",
  },
  sidebarStyleRelatedQuestion: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "15px",
    color: "#003366",
    width: "260px",
  },
  sidebarStyleHotQuestion: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "30px",
    color: "#003366",
    width: "260px",
  },
  gridStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    marginTop: "20px",
  },
  courseCard: {
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    color: "white",
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "white",
  },
  coursePrice: {
    color: "#ffeb3b",
    fontWeight: "bold",
  },
  courseInfo: {
    fontSize: "14px",
    marginTop: "5px",
  },
  freeCourseCard: {
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
  iconStyle: {
    fontSize: "20px",
    color: "#007bff",
  },
  freeCourseInfo: {
    fontSize: "14px",
    marginTop: "5px",
    color: "#777",
  },
};

export default TeacherListCourses;

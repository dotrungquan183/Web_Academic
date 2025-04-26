import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TeacherCoursesLayout from "../../Layout";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../../../../auth/authHelper";
import { FaBookOpen, FaFire } from "react-icons/fa";

const sampleCourses = [
  { id: 1, title: "HTML/CSS Pro", type: "pro", price: 12.99, teacher: "John Doe", students: 1200, duration: "10h" },
  { id: 2, title: "JavaScript Pro", type: "pro", price: 14.99, teacher: "Jane Smith", students: 900, duration: "12h" },
  { id: 3, title: "Sass Language", type: "pro", price: 9.99, teacher: "Alice Lee", students: 800, duration: "8h" },
  { id: 4, title: "Foundational Knowledge", type: "free", teacher: "Team Dev", duration: "5h" },
  { id: 5, title: "C++ Programming", type: "free", teacher: "Học viện Code", duration: "6h" },
  { id: 6, title: "HTML/CSS From Zero", type: "free", teacher: "FrontEnd.vn", duration: "7h" },
  { id: 7, title: "Responsive Web Design", type: "free", teacher: "DevTips", duration: "4h" }
];

const TeacherListCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const fetchUserFromToken = useCallback(() => {
    const token = getToken();
    if (token) {
      try {
        jwtDecode(token);
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserFromToken();
    setCourses(sampleCourses);
  }, [fetchUserFromToken]);

  const proCourses = courses.filter(course => course.type === "pro");
  const freeCourses = courses.filter(course => course.type === "free");

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

          <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>PRO COURSES</h2>
          <div style={styles.gridStyle}>
            {proCourses.map(course => (
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
                <p style={styles.coursePrice}>${course.price}</p>
                <p style={styles.courseInfo}>
                  {course.teacher} • {course.students} students • {course.duration}
                </p>
              </div>
            ))}
          </div>

          <h2 style={{ textAlign: "center", textTransform: "uppercase", marginTop: "20px" }}>FREE COURSES</h2>
          <div style={styles.gridStyle}>
            {freeCourses.map(course => (
              <div key={course.id} style={styles.freeCourseCard}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.freeCourseInfo}>Free • {course.teacher} • {course.duration}</p>
              </div>
            ))}
          </div>
        </div>

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

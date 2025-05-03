import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaRoad, FaPen } from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const isCoursesTab = location.pathname.startsWith("/teachercourses/listcourses");
  const isRoadmapTab= location.pathname.startsWith("/teachercourses/roadmap");
  const isPostTab = location.pathname.startsWith("/teachercourses/post");

  return (
    <div style={styles.sidebar}>
      <Link to="/teachercourses/listcourses" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isCoursesTab ? "#003366" : "transparent",
            color: isCoursesTab ? "white" : "#003366",
          }}
        >
          <FaBook style={styles.icon} /> Khóa học
        </button>
      </Link>

      <Link to="/teachercourses/roadmap" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isRoadmapTab ? "#003366" : "transparent",
            color: isRoadmapTab ? "white" : "#003366",
          }}
        >
          <FaRoad style={styles.icon} /> Lộ trình
        </button>
      </Link>

      <Link to="/teachercourses/post" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isPostTab ? "#003366" : "transparent",
            color: isPostTab ? "white" : "#003366",
          }}
        >
          <FaPen style={styles.icon} /> Bài viết
        </button>
      </Link>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: "#ffffff",
    height: "100vh",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    paddingTop: "53px",
    position: "sticky", // Giữ sidebar cố định khi cuộn
    top: "0", // Đảm bảo nó không di chuyển
    borderRight: "1px solid #ccc",
    marginTop: "-15px",
    marginRight: "-300px",
  },
  button: {
    padding: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
    borderBottom: "1px solid #ccc",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
    verticalAlign: "middle",
    
  },
  link: {
    textDecoration: "none",
  },
  menuIcon: {
    position: "absolute",
    top: "150px",
    left: "10px",
    cursor: "pointer",
    color: "black",
  },
};

export default Sidebar;

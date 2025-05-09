import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHelpCircle, FiXCircle} from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  
  const isForumTab = location.pathname.startsWith("/teacherprofile/forum");
  const isCoursesTab = location.pathname.startsWith("/teacherprofile/courses");

  return (
    <div style={styles.sidebar}>
      <Link to="/teacherprofile/forum" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isForumTab ? "#003366" : "transparent",
            color: isForumTab ? "white" : "#003366",
          }}
        >
          <FiHelpCircle style={styles.icon} /> Diễn đàn
        </button>
      </Link>

      <Link to="/teacherprofile/courses" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isCoursesTab ? "#003366" : "transparent",
            color: isCoursesTab ? "white" : "#003366",
          }}
        >
          <FiXCircle style={styles.icon} /> Khóa học
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

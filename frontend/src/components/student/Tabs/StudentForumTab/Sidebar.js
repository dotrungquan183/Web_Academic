import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHelpCircle, FiXCircle, FiTag, FiSave } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  return (
    <div style={styles.sidebar}>
      <Link to="/studentforum/question" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: location.pathname.startsWith("/studentforum/question") ? "#003366" : "transparent", // Kiểm tra xem URL có bắt đầu với "/studentforum/question"
            color: location.pathname.startsWith("/studentforum/question") ? "white" : "#003366", // Nếu đúng, đổi màu chữ
          }}
        >
          <FiHelpCircle style={styles.icon} /> Câu hỏi
        </button>
      </Link>
      <Link to="/studentforum/unanswer" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: location.pathname === "/studentforum/unanswer" ? "#003366" : "transparent",
            color: location.pathname === "/studentforum/unanswer" ? "white" : "#003366",
          }}
        >
          <FiXCircle style={styles.icon} /> Chưa trả lời
        </button>
      </Link>
      <Link to="/studentforum/tag" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: location.pathname === "/studentforum/tag" ? "#003366" : "transparent",
            color: location.pathname === "/studentforum/tag" ? "white" : "#003366",
          }}
        >
          <FiTag style={styles.icon} /> Thẻ
        </button>
      </Link>
      <Link to="/studentforum/save" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: location.pathname === "/studentforum/save" ? "#003366" : "transparent",
            color: location.pathname === "/studentforum/save" ? "white" : "#003366",
          }}
        >
          <FiSave style={styles.icon} /> Lưu trữ
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

import { Link, useLocation } from "react-router-dom";
import { FiHelpCircle, FiXCircle, FiTag, FiSave } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  const isQuestionPath = location.pathname.startsWith("/adminforum/question");
  const isUnansweredTab = location.pathname.startsWith("/adminforum/unanswer");
  const isQuestionTab = isQuestionPath && !isUnansweredTab;
  const isTagTab = location.pathname.startsWith("/adminforum/tag");
  const isSaveTab = location.pathname.startsWith("/adminforum/save");

  return (
    <div style={styles.sidebar}>
      <Link to="/adminforum/question" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isQuestionTab ? "#003366" : "transparent",
            color: isQuestionTab ? "white" : "#003366",
          }}
        >
          <FiHelpCircle style={styles.icon} /> Câu hỏi
        </button>
      </Link>

      <Link to="/adminforum/unanswer" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isUnansweredTab ? "#003366" : "transparent",
            color: isUnansweredTab ? "white" : "#003366",
          }}
        >
          <FiXCircle style={styles.icon} /> Chưa trả lời
        </button>
      </Link>

      <Link to="/adminforum/tag" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isTagTab ? "#003366" : "transparent",
            color: isTagTab ? "white" : "#003366",
          }}
        >
          <FiTag style={styles.icon} /> Thẻ
        </button>
      </Link>

      <Link to="/adminforum/save" style={styles.link}>
        <button
          style={{
            ...styles.button,
            backgroundColor: isSaveTab ? "#003366" : "transparent",
            color: isSaveTab ? "white" : "#003366",
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

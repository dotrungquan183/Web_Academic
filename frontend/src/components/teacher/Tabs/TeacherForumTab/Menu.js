import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherForumTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/Teacherforum/question");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default TeacherForumTab;

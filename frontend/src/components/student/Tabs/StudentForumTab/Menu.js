import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentForumTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/studentforum/question");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default StudentForumTab;

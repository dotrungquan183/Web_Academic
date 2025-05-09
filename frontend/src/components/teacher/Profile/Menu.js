import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherProfileTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/teacherprofile/forum");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default TeacherProfileTab;

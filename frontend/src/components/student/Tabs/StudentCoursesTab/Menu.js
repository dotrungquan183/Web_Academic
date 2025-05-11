import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/studentcourses/listcourses");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default TeacherCoursesTab;

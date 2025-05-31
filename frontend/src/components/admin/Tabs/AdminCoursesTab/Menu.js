import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminCoursesTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/admincourses/listcourses");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default AdminCoursesTab;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentProfileTab() {
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển hướng sang trang "Câu hỏi"
    navigate("/studentprofile/forum");
  }, [navigate]);

  return null; // Không render gì cả vì nó sẽ chuyển trang luôn
}

export default StudentProfileTab;

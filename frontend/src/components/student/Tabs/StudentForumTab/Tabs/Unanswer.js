import React, { useEffect, useState } from "react";
import StudentForumLayout from "../Layout";

function StudentForumUnanswer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_forum/student_unanswer/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <StudentForumLayout>
      <h2 style={{ color: "#003366", marginTop: "-25px" }}>Chưa trả lời</h2>
      {data ? (
        <p style={{ color: "#003366", marginTop: "-4px" }}>{data.content}</p>
      ) : (
        <p style={{ color: "#003366", marginTop: "-4px" }}>Đang tải dữ liệu...</p>
      )}
    </StudentForumLayout>
  );
}

export default StudentForumUnanswer;

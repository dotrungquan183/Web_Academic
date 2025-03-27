import React, { useEffect, useState } from "react";
import TeacherForumLayout from "../Layout";

function TeacherForumUnanswer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/teacher/teacher_forum/teacher_unanswer/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <TeacherForumLayout>
      <h2 style={{ color: "#003366", marginTop: "-25px" }}>Chưa trả lời</h2>
      {data ? (
        <p style={{ color: "#003366", marginTop: "-4px" }}>{data.content}</p>
      ) : (
        <p style={{ color: "#003366", marginTop: "-4px" }}>Đang tải dữ liệu...</p>
      )}
    </TeacherForumLayout>
  );
}

export default TeacherForumUnanswer;

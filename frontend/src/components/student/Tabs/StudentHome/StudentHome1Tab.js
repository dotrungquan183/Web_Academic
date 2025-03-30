import React, { useEffect, useState } from "react";

function StudentHome1() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_home/student_home1/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      {data ? <p style={{ color: "white" }}>{data.content}</p> : <p style={{ color: "white" }}>Loading...</p>}
    </div>
  );
}

export default StudentHome1;

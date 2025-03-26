import React, { useState, useEffect } from 'react';

function StudentCoursesTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/student/student_courses/student_courses/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div>
      {data ? (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khóa học</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}

export default StudentCoursesTab;

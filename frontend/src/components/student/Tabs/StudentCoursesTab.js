import React, { useState, useEffect } from 'react';

function StudentCoursesTab() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/student/student_courses/student_courses/')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Khóa học</h1>
      {courses.length === 0 ? (
        <p>Không có khóa học nào để hiển thị.</p>
      ) : (
        courses.map(course => (
          <div key={course.id} className="mb-8 border rounded-lg shadow p-4">
            {course.chapters.map(chapter => (
              <div key={chapter.id} className="mt-4">
                {chapter.lessons.map(lesson => (
                  <div key={lesson.id} className="mb-2">
                    <video width="320" height="240" controls>
                      {/* Cập nhật đường dẫn video đúng */}
                      <source 
                        src={`http://127.0.0.1:8000/image/videos/file.mp4`} 
                        type="video/mp4" 
                      />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default StudentCoursesTab;

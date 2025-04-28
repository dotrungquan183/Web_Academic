import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentCoursesTab() {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/student/student_courses/student_courses/")  // thay đúng API path
      .then(response => {
        if (response.data.length > 0) {
          setCourseData(response.data[0]);  // Lấy khóa học đầu tiên
        }
      })
      .catch(error => {
        console.error("Error fetching course data:", error);
      });
  }, []);

  if (!courseData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.contentContainer}>
        <h2 style={styles.title}>Bạn sẽ học được gì?</h2>
        <div style={styles.sectionContainer}>
          
          {/* Trái - Text */}
          <div style={styles.textSection}>
            <ul style={styles.list}>
              <li>Nắm chắc lý thuyết chung trong việc xây dựng web</li>
              <li>Xây dựng web với Express bằng kiến thức thực tế</li>
              <li>Nắm chắc lý thuyết về API và RESTful API</li>
              <li>Nắm chắc khái niệm về giao thức HTTP</li>
              <li>Học được cách tổ chức code trong thực tế</li>
              <li>Biết cách làm việc với Mongoose, MongoDB trong NodeJS</li>
              <li>Biết cách xây dựng API theo chuẩn RESTful API</li>
              <li>Được chia sẻ lại kinh nghiệm làm việc thực tế</li>
              <li>Hiểu rõ tư tưởng và cách hoạt động của mô hình MVC</li>
              <li>Biết cách deploy website lên internet</li>
            </ul>
          </div>

          {/* Phải - Video */}
          <div style={styles.videoSection}>
            <div style={styles.videoWrapper}>
              <video style={styles.video} controls>
                <source src={courseData.intro_video} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: { padding: "20px", backgroundColor: "#f9f9f9" },
  contentContainer: { maxWidth: "1200px", margin: "auto" },
  title: { fontSize: "24px", marginBottom: "20px" },
  sectionContainer: { display: "flex", gap: "20px" },
  textSection: { flex: 1 },
  list: { paddingLeft: "20px" },
  videoSection: { flex: 1 },
  videoWrapper: { position: "relative", paddingTop: "56.25%", height: 0 },
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }
};

export default StudentCoursesTab;

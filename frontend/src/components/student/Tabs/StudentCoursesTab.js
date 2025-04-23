import React from "react";

function StudentCoursesTab() {
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
              <iframe
                src="https://www.youtube.com/embed/uz5LIP85J5Y"
                title="Video bài học"
                style={styles.iframe}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  },
  contentContainer: {
    maxWidth: "1000px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#003366",
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap", // để responsive
  },
  textSection: {
    flex: "1",
    minWidth: "300px",
    backgroundColor: "rgba(220, 220, 220, 0.3)",
    padding: "20px",
    borderRadius: "8px",
  },
  list: {
    paddingLeft: "20px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#333",
  },
  videoSection: {
    flex: "1",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // Tỷ lệ 16:9
    height: 0,
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
};

export default StudentCoursesTab;

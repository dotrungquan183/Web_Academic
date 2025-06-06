import React from "react";
import { Calendar, Clock } from "lucide-react";
import "./UpcomingCourses.css";

const UpcomingCourses = () => {
  const courses = [
    {
      id: 1,
      thumbnail: "/mathicon.png",
      title: "Khóa Học Đại Số Cơ Bản",
      description: "Học các khái niệm cơ bản về đại số, phương trình và bất phương trình dành cho học sinh THPT.",
      time: "7:00 PM - 9:00 PM",
      buttonColor: "btn-blue"
    },
    {
      id: 2,
      thumbnail: "/mathicon.png",
      title: "Hình Học Không Gian Nâng Cao",
      description: "Khám phá thế giới hình học 3D với các bài tập thực hành và ứng dụng thực tế.",
      time: "2:30 PM - 5:00 PM",
      buttonColor: "btn-purple"
    },
    {
      id: 3,
      thumbnail: "/mathicon.png",
      title: "Giải Tích Lớp 12 Ôn Thi",
      description: "Ôn tập toàn diện các chủ đề giải tích quan trọng cho kỳ thi THPT Quốc gia.",
      time: "5:00 PM - 6:30 PM",
      buttonColor: "btn-cyan"
    },
    {
      id: 4,
      thumbnail: "/mathicon.png",
      title: "Toán Tư Duy và Logic",
      description: "Phát triển tư duy logic và kỹ năng giải quyết vấn đề thông qua các trò chơi toán học thú vị.",
      time: "6:00 PM - 8:30 PM",
      buttonColor: "btn-indigo"
    }
  ];

  return (
    <section className="upcoming-section">
      <div className="upcoming-container">
        {/* Header */}
        <div className="upcoming-header">
          <div className="upcoming-icon">
            <Calendar className="icon-white" />
          </div>
          <h2 className="upcoming-title">Các Khóa Học Sắp Tới</h2>
        </div>

        {/* Course Cards Grid */}
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-inner">
                {/* Thumbnail */}
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                </div>

                {/* Content */}
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-time">
                    <Clock className="time-icon" />
                    <span>{course.time}</span>
                  </div>
                  <button className={`course-btn ${course.buttonColor}`}>
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Calendar Button */}
        <div className="calendar-button-container">
          <button className="calendar-button">
            <Calendar className="icon" />
            Xem Tất Cả Khóa Học
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourses;

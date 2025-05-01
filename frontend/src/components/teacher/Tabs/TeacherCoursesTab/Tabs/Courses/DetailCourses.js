import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaClock,
  FaGraduationCap,
  FaLayerGroup,
  FaPlayCircle,
  FaTag,
} from "react-icons/fa";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

// ✅ Hàm xử lý chuỗi "HH:mm:ss" thành "hh giờ mm phút"
function formatDuration(hhmmss) {
  if (!hhmmss || typeof hhmmss !== "string") return "00 giờ 00 phút";
  const parts = hhmmss.split(":").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "00 giờ 00 phút";

  const [hours, minutes] = parts;
  return `${hours.toString().padStart(2, "0")} giờ ${minutes
    .toString()
    .padStart(2, "0")} phút`;
}

const levelDisplay = {
  basic: "Cơ bản",
  medium: "Trung bình",
  hard: "Khó",
};

const CoursePreviewMedia = ({ videoSrc, thumbnail }) => {
  if (videoSrc) {
    return (
      <video controls className="w-full rounded-md shadow" preload="metadata">
        <source src={videoSrc} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ phát video.
      </video>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md shadow">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Ảnh khóa học"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span className="text-gray-400">Không có ảnh khóa học</span>
      )}
    </div>
  );
};

function TeacherDetailCourses() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/teacher/teacher_courses/teacher_detailcourses/${courseId}/`
        );
        setCourse(res.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khóa học:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) return <p>Đang tải dữ liệu...</p>;

  const videoURL = course.intro_video ? `${BASE_URL}${course.intro_video}` : null;
  const thumbnailURL = course.thumbnail ? `${BASE_URL}${course.thumbnail}` : null;
  const durationText = formatDuration(course.total_duration);
  const videoCount = Number(course.video_count) || 0;
  const studentCount = Number(course.student_count) || 0;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.intro}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <FaGraduationCap /> {studentCount} người học
            </div>
            <div className="flex items-center gap-2">
              <FaPlayCircle /> {videoCount} video
            </div>
            <div className="flex items-center gap-2">
              <FaClock /> {durationText}
            </div>
            <div className="flex items-center gap-2">
              <FaLayerGroup /> Trình độ: {levelDisplay[course.level] || "Không rõ"}
            </div>
            <div className="flex items-center gap-2">
              <FaTag /> Tags: {course.tags || "Không có"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Giới thiệu khóa học</h2>
            <CoursePreviewMedia videoSrc={videoURL} thumbnail={thumbnailURL} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {thumbnailURL ? (
              <img
                src={thumbnailURL}
                alt="Ảnh khóa học"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">Không có ảnh</span>
            )}
          </div>

          <div>
            <p className="text-lg font-bold text-orange-600">
              {Number(course.fee) === 0 ? "Miễn phí" : `${course.fee} VND`}
            </p>
            <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Đăng ký học
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Tạo lúc: {new Date(course.created_at).toLocaleString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailCourses;

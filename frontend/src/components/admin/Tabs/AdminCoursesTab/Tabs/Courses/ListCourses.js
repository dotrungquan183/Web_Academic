import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../../../../auth/authHelper";
import { FaBookOpen, FaFire, FaUserTie, FaUsers, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from 'axios';

const AdminListCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [visibleProCount, setVisibleProCount] = useState(6);
  const [visibleFreeCount, setVisibleFreeCount] = useState(6);
  const [latestCourses, setLatestCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [selectedFilter,] = useState("all");
  const fetchUserFromToken = useCallback(() => {
    const token = getToken();
    if (token) {
      try {
        jwtDecode(token);
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // 🔥 Hot courses
  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/admin_courses/admin_bestcourses/')
      .then(response => {
        setHotCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching hot courses:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/admin_courses/admin_lastestcourses/')
      .then(response => {
        setLatestCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching latest courses:', error);
      });
  }, []);


  // 📚 All/mine courses
  useEffect(() => {
    console.log("Selected filter:", selectedFilter);
    fetchUserFromToken();

    const fetchCourses = async () => {
      try {
        const token = getToken(); // Lấy token từ helper
        console.log("Token:", token); // Log token để kiểm tra

        const url = `http://localhost:8000/api/admin/admin_courses/admin_addcourses/?filter=${selectedFilter}`;
        console.log("API URL:", url); // Log URL để kiểm tra xem filter có đúng không

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token cùng với header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        console.log("Fetched courses data:", data); // Log dữ liệu trả về từ API

        setCourses(data); // Cập nhật state với dữ liệu mới
      } catch (error) {
        console.error("Error fetching courses:", error); // Log lỗi nếu có
      }
    };

    fetchCourses();
  }, [fetchUserFromToken, selectedFilter]); // 👈 Update khi selectedFilter đổi

  const proCourses = courses.filter(course => parseFloat(course.fee) > 0);
  const freeCourses = courses.filter(course => parseFloat(course.fee) === 0);

  return (
    <div style={styles.layoutStyle}>
      <div style={styles.containerStyle}>
        <div style={styles.headerWithButton}>
          {/* Bên trái: Tiêu đề và combobox nằm sát nhau */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
            gap: "20px",
            marginRight: "15px"
          }}>
            <h2 style={{
              textTransform: "uppercase",
              color: "#003366",
              margin: 0,
              fontSize: "20px"
            }}>
              Danh sách khóa học
            </h2>
          </div>
        </div>

        {/* PRO COURSES */}
        <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>PRO COURSES</h2>
        <div style={styles.gridStyle}>
          {proCourses.slice(0, visibleProCount).map(course => {
            const imageUrl = course.thumbnail?.startsWith("http")
              ? course.thumbnail
              : `http://localhost:8000${course.thumbnail}`;

            const handleApprove = async (courseId) => {
              const confirmPublish = window.confirm("Lưu thay đổi và xuất bản khóa học?");
              if (!confirmPublish) return;

              const token = getToken();
              if (!token) {
                alert("❌ Bạn chưa đăng nhập!");
                return;
              }

              try {
                const response = await fetch(
                  `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ is_approve: 1 }),
                  }
                );

                const result = await response.json();
                if (response.ok) {
                  alert("✅ Đã đăng (phê duyệt) khóa học thành công!");
                  window.location.reload();
                } else {
                  alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
                  console.error("Chi tiết lỗi:", result);
                }
              } catch (error) {
                console.error("❌ Có lỗi xảy ra khi phê duyệt khóa học:", error);
                alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
              }
            };


            const handleReject = async (courseId) => {
              const token = getToken();
              if (!token) {
                alert("❌ Bạn chưa đăng nhập!");
                return;
              }

              const confirmDelete = window.confirm(
                "Bạn chắc chắn muốn từ chối và xóa khóa học này không?"
              );

              if (!confirmDelete) return;

              try {
                const response = await fetch(
                  `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (response.ok) {
                  alert("✅ Đã từ chối và xóa khóa học!");
                  window.location.reload(); // 🔄 Reload trang
                } else {
                  const result = await response.json();
                  alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
                  console.error("Chi tiết lỗi:", result);
                }
              } catch (error) {
                console.error("❌ Có lỗi xảy ra:", error);
                alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
              }
            };




            return (
              <div
                key={course.id}
                style={{
                  ...styles.courseCard,
                  position: "relative",
                  background: course.id % 2 === 0
                    ? "linear-gradient(to right, #0d47a1, #003366)"
                    : "white",
                  color: course.id % 2 === 0
                    ? "white"
                    : "#003366",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)}
              >
                {/* Phê duyệt / Từ chối icons */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  display: "flex",
                  gap: "10px",
                  zIndex: 2,
                }}
                  onClick={(e) => e.stopPropagation()} // Ngăn không navigate khi click icon
                >
                  <FaCheckCircle
                    size={25}
                    color="48b169"
                    title="Phê duyệt"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleApprove(course.id)}
                  />
                  <FaTimesCircle
                    size={25}
                    color="red"
                    title="Từ chối"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleReject(course.id)}
                  />
                </div>

                <div style={styles.courseImageWrapper}>
                  <img
                    src={imageUrl}
                    alt={course.title}
                    style={styles.courseImage}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <div style={styles.courseInfoWrapper}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.coursePrice}>{course.fee} VNĐ</p>
                  <p style={styles.courseInfo}>
                    <FaUserTie style={{ marginRight: "4px" }} /> {course.teacher}
                    <span style={{ marginLeft: "12px" }}>🎬 {course.video_count} video</span>
                    <FaClock style={{ margin: "0 6px 0 12px" }} /> {course.total_duration}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {proCourses.length > 6 && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p
              style={{
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontStyle: "italic",
              }}
              onClick={() =>
                setVisibleProCount(
                  visibleProCount === proCourses.length ? 6 : proCourses.length
                )
              }
            >
              {visibleProCount === proCourses.length ? "Ẩn bớt" : "Xem thêm khóa học..."}
            </p>
          </div>
        )}

        {/* FREE COURSES */}
        <h2 style={{ textAlign: "center", textTransform: "uppercase", marginTop: "20px" }}>
          FREE COURSES
        </h2>

        <div style={styles.gridStyle}>
          {freeCourses.slice(0, visibleFreeCount).map(course => {
            const imageUrl = course.thumbnail?.startsWith("http")
              ? course.thumbnail
              : `http://localhost:8000${course.thumbnail}`;
            const handleApprove = async (courseId) => {
              const confirmPublish = window.confirm("Lưu thay đổi và xuất bản khóa học?");
              if (!confirmPublish) return;

              const token = getToken();
              if (!token) {
                alert("❌ Bạn chưa đăng nhập!");
                return;
              }

              try {
                const response = await fetch(
                  `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ is_approve: 1 }),
                  }
                );

                const result = await response.json();
                if (response.ok) {
                  alert("✅ Đã đăng (phê duyệt) khóa học thành công!");
                  window.location.reload(); // 🔄 Reload lại trang
                } else {
                  alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
                  console.error("Chi tiết lỗi:", result);
                }
              } catch (error) {
                console.error("❌ Có lỗi xảy ra khi phê duyệt khóa học:", error);
                alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
              }
            };


            const handleReject = async (courseId) => {
              const token = getToken();
              if (!token) {
                alert("❌ Bạn chưa đăng nhập!");
                return;
              }

              const confirmDelete = window.confirm(
                "Bạn chắc chắn muốn từ chối và xóa khóa học này không?"
              );

              if (!confirmDelete) return;

              try {
                const response = await fetch(
                  `http://localhost:8000/api/admin/admin_courses/admin_addcourses/${courseId}/`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (response.ok) {
                  alert("✅ Đã từ chối và xóa khóa học!");
                  window.location.reload(); // 🔄 Reload trang
                } else {
                  const result = await response.json();
                  alert(`❌ Lỗi: ${result.detail || result.error || "Không rõ lỗi"}`);
                  console.error("Chi tiết lỗi:", result);
                }
              } catch (error) {
                console.error("❌ Có lỗi xảy ra:", error);
                alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
              }
            };


            return (
              <div
                key={course.id}
                style={{
                  ...styles.courseCard,
                  background: course.id % 2 === 0
                    ? "linear-gradient(to right, #0d47a1, #003366)"
                    : "white",
                  color: course.id % 2 === 0
                    ? "white"
                    : "#003366",
                  cursor: "pointer",
                  position: "relative", // cần để hiển thị icon ở góc
                }}
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)}
              >
                {/* ICON Phê duyệt và Từ chối */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    display: "flex",
                    gap: "10px",
                    zIndex: 2,
                  }}
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn điều hướng khi click icon
                >
                  <FaCheckCircle
                    size={25}
                    color="#48b169"
                    title="Phê duyệt"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleApprove(course.id)}
                  />
                  <FaTimesCircle
                    size={25}
                    color="red"
                    title="Từ chối"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleReject(course.id)}
                  />
                </div>

                {/* Hình và thông tin */}
                <div style={styles.courseImageWrapper}>
                  <img
                    src={imageUrl}
                    alt={course.title}
                    style={styles.courseImage}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <div style={styles.courseInfoWrapper}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.courseInfo}>
                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                      <FaUsers style={{ marginRight: "4px" }} /> {course.students} students
                      <span style={{ marginLeft: "12px" }}>
                        🎬 {course.video_count} video
                      </span>
                      <FaClock style={{ marginRight: "4px", marginLeft: "12px" }} />
                      {course.total_duration}
                    </div>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {freeCourses.length > 6 && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p
              style={{
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontStyle: "italic",
              }}
              onClick={() =>
                setVisibleFreeCount(
                  visibleFreeCount === freeCourses.length ? 6 : freeCourses.length
                )
              }
            >
              {visibleFreeCount === freeCourses.length ? "Ẩn bớt" : "Xem thêm khóa học..."}
            </p>
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <div style={styles.sidebarWrapper}>
        <div style={styles.sidebarStyleRelatedQuestion}>
          <h3 style={styles.sidebarTitle}>
            <FaBookOpen style={styles.iconStyle} /> Khóa học mới nhất
          </h3>
          <ul>
            {latestCourses.map((course) => (
              <li
                key={course.id}
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)} // Điều hướng khi click
                style={{ ...styles.linkStyle, cursor: 'pointer' }} // Đảm bảo có con trỏ khi hover
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.sidebarStyleHotQuestion}>
          <h3 style={styles.sidebarTitle}>
            <FaFire style={styles.iconStyle} /> Khóa học nổi bật
          </h3>
          <ul>
            {hotCourses.map(course => (
              <li
                key={course.id}
                onClick={() => navigate(`/admincourses/listcourses/${course.id}`)} // Điều hướng khi click
                style={{ ...styles.linkStyle, cursor: 'pointer' }} // Đảm bảo có con trỏ khi hover
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layoutStyle: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginLeft: "160px",
    alignItems: "flex-start",
    loadMoreButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 16px",
      fontSize: "14px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "10px",
    },
  },
  containerStyle: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "30px",
    marginTop: "15px",
    marginLeft: "-125px",
    width: "1100px",
    color: "#003366",
  },
  headerWithButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  addButton: {
    padding: "8px 12px",
    backgroundColor: "#003366",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  sidebarWrapper: {
    width: "260px",
    flexShrink: 0,
  },
  sidebarTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    gap: "8px",
    color: "#003366",
  },
  sidebarStyleRelatedQuestion: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "15px",
    color: "#003366",
    width: "260px",
  },
  sidebarStyleHotQuestion: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "30px",
    color: "#003366",
    width: "260px",
  },
  gridStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    marginTop: "20px",
  },
  courseCard: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #003366",
    backgroundColor: "#003366",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    height: "180px",
    overflow: "hidden",
    lineHeight: "1.2",
  },
  courseImage: {
    width: "100%",
    height: "65px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "-15px",
  },
  courseTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "4px",
    //color: "white",
  },
  coursePrice: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  courseInfo: {
    fontSize: "14px",
    marginTop: "3px",
    //color: "white",
  },
  freeCourseCard: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #003366",
    backgroundColor: "#003366",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    height: "180px",
    overflow: "hidden",
    lineHeight: "1.2",
  },
  freeCourseInfo: {
    fontSize: "14px",
    marginTop: "5px",
    color: "#white",
  },
  iconStyle: {
    fontSize: "20px",
    color: "#007bff",
  },
  dotIcon: {
    fontSize: "6px",
    margin: "0 6px",
    verticalAlign: "middle",
    color: "#999",
  },
};

export default AdminListCourses;

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";

Modal.setAppElement('#root'); // để tránh lỗi truy cập modal cho accessibility

const StudentListModal = ({ isOpen, onClose }) => {
    const { courseId } = useParams(); // lấy courseId từ url params
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetch(`http://localhost:8000/api/teacher/teacher_courses/teacher_listregistrycourses/${courseId}/`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("Dữ liệu trả về từ backend:", data);
                    setStudents(data.students || []);
                })
                .catch((err) => console.error("Lỗi khi lấy danh sách học viên:", err));
        }
    }, [isOpen, courseId]);


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Danh sách học viên"
            style={{
                content: {
                    maxWidth: "700px",
                    margin: "auto",
                    padding: "20px 30px 30px 30px",
                    inset: "40px",
                    position: "relative",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
            }}
        >
            {/* Nút X góc trên bên phải */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    fontSize: "28px",      // to hơn
                    cursor: "pointer",
                    fontWeight: "bold",
                    lineHeight: 1,
                    color: "red",          // màu đỏ
                }}
                aria-label="Close modal"
            >
                &times;
            </button>

            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách học viên</h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th style={{ padding: "10px" }}>Tên học viên</th>
                        <th style={{ padding: "10px" }}>Email</th>
                        <th style={{ padding: "10px" }}>Hoạt động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px" }}>{student.username}</td>
                                <td style={{ padding: "8px" }}>{student.email}</td>
                                <td style={{ padding: "8px" }}>{student.last_login ? "Hoạt động" : "Không hoạt động"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ padding: "20px", textAlign: "center" }}>
                                Không có học viên nào đăng ký
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
};

export default StudentListModal;

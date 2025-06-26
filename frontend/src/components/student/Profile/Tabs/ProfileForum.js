import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../auth/authHelper";
//import TeacherProfileLayout from "../Layout";
import { renderWithLatex } from "../../../teacher/Tabs/TeacherForumTab/TeacherLatexInputKaTeX";

const getAvatarUrl = (user) => {
  if (user?.avatar) {
    return user.avatar.startsWith("http") ? user.avatar : `http://localhost:8000${user.avatar}`;
  }
  return null;
};

const StudentProfileForum = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterquestion, setFilterQuestion] = useState("newest");
  const [filteranswer, setFilterAnswer] = useState("newest");
  const [answers, setAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [tags, setTags] = useState([]);
  const [filtertag, setFilterTag] = useState("top"); // default là top 5
  const [showAllTags, setShowAllTags] = useState(false);
  const [stats, setStats] = useState(null);
  const [voteStats, setVoteStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://localhost:8000/api/teacher/teacher_profile/teacher_account`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Dữ liệu trả về từ API:", response.data); // ✅ Log dữ liệu tại đây
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, []);


  useEffect(() => {
    const fetchVoteStats = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:8000/api/teacher/teacher_profile/teacher_vote", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setVoteStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin vote:", error);
      }
    };

    fetchVoteStats();
  }, []);

  // ✅ useEffect này luôn được gọi
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          "http://localhost:8000/api/teacher/teacher_profile/teacher_stat",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  const handleCloseModal = () => {
    setShowAllTags(false); // Đóng modal
  };

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      const token = getToken(); // lấy token từ localStorage hoặc context
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_profile/teacher_tag?filter=${filtertag}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  }, [filtertag]); // Phụ thuộc vào filtertag

  useEffect(() => {
    fetchTags(); // gọi khi component mount hoặc filtertag thay đổi
  }, [fetchTags]);

  const handleTagsAll = () => {
    setFilterTag("all");
    setShowAllTags(true);
  };

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_profile/teacher_question?filter=${filterquestion}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  }, [filterquestion]); // Phụ thuộc vào filterquestion

  const fetchAllQuestions = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_profile/teacher_question?filter=all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch all questions", error);
    }
  }, []);

  useEffect(() => {
    fetchQuestions(); // gọi khi filterquestion thay đổi
  }, [fetchQuestions]);

  // Fetch answers
  const fetchAnswers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_profile/teacher_answer?filter=${filteranswer}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("Failed to fetch answers", error);
    }
  }, [filteranswer]); // Phụ thuộc vào filteranswer

  const fetchAllAnswers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_profile/teacher_answer?filter=all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllAnswers(response.data);
    } catch (error) {
      console.error("Failed to fetch all answers", error);
    }
  }, []);

  useEffect(() => {
    fetchAnswers(); // gọi khi filteranswer thay đổi
  }, [fetchAnswers]);

  const handleQuestionClick = (id) => {
    navigate(`/studentforum/question/${id}`);
  };
  return (
      <div style={styles.pageLayout}>
        {/* Top Section */}
        <div style={styles.topBox}>
          {user && (
            <>
              <div style={styles.avatarIcon}>
                {getAvatarUrl(user) ? (
                  <img
                    src={getAvatarUrl(user)}
                    alt="avatar"
                    style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                  />
                ) : (
                  "👤"
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.user}>
                  <h2 style={{ fontSize: "28px", marginBottom: "5px" }}>{user.username}</h2>
                  <p>Là thành viên {user.member_for}</p>
                  <p>Hoạt động {user.last_seen}</p>
                </div>
                <div style={styles.aboutBox}>
                  "Less is more, but less is also less. Perchance?"
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Layout */}
        <div style={styles.bottomLayout}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/*Question*/}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Câu hỏi</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  style={styles.viewAllLink}
                  onClick={() => {
                    fetchAllQuestions(); // fetch tất cả câu hỏi
                    setShowAllQuestions(true); // mở modal
                  }}
                >
                  Xem tất cả câu hỏi
                </button>

                <div style={styles.filterBar}>
                  {["newest", "bountied", "votes", "views"].map((f) => (
                    <button
                      key={f}
                      style={{
                        ...styles.filterButton,
                        fontWeight: filterquestion === f ? "bold" : "normal",
                      }}
                      onClick={() => {
                        setFilterQuestion(f);
                        setShowAllQuestions(false);
                      }}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <ul style={styles.list}>
                {questions.map((q) => (
                  <li
                    key={q.id}
                    style={{ ...styles.questionRow, cursor: "pointer" }}
                    onClick={() => handleQuestionClick(q.id)}
                  >
                    <div
                      style={{
                        ...styles.voteBox,
                        backgroundColor:
                          q.vote_score > 0
                            ? "#2e7d32"
                            : q.vote_score < 0
                              ? "#c62828"
                              : "#003366",
                      }}
                    >
                      {q.vote_score}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        width: "100%",
                        gap: "10px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "530px",
                            overflow: "hidden",
                            flex: 1, // cho phép title co giãn
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {renderWithLatex(q.title)}
                        </div>

                        <div
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "0.9em",
                            color: "#666",
                            minWidth: "90px",
                            textAlign: "right",
                          }}
                        >
                          {new Date(q.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </div>

                    </div>

                  </li>
                ))}
              </ul>

              {showAllQuestions && (
                <div style={styles.modalOverlay}>
                  <div style={styles.modalContent}>
                    <div style={styles.modalHeader}>
                      <h3 style={{ margin: 0 }}>All Questions</h3>
                      <button
                        onClick={() => setShowAllQuestions(false)}
                        style={styles.closeButton}
                      >
                        ✕
                      </button>
                    </div>
                    <ul style={styles.list}>
                      {allQuestions.map((q) => (
                        <li
                          key={q.id}
                          style={{ ...styles.questionRow, cursor: "pointer" }}
                          onClick={() => handleQuestionClick(q.id)}
                        >
                          <div
                            style={{
                              ...styles.voteBox,
                              backgroundColor:
                                q.vote_score > 0
                                  ? "#2e7d32"
                                  : q.vote_score < 0
                                    ? "#c62828"
                                    : "#003366",
                            }}
                          >
                            {q.vote_score}
                          </div>
                          <div
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "530px",
                              overflow: "hidden",
                              flex: 1, // cho phép title co giãn
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            {renderWithLatex(q.title)}
                          </div>

                          <div
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "0.9em",
                              color: "#666",
                              minWidth: "90px",
                              textAlign: "right",
                            }}
                          >
                            {new Date(q.created_at).toLocaleDateString("vi-VN")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Câu trả lời</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  style={styles.viewAllLink}
                  onClick={() => {
                    fetchAllAnswers(); // fetch tất cả câu hỏi
                    setShowAllAnswers(true); // mở modal
                  }}
                >
                  Xem tất cả câu trả lời
                </button>

                <div style={styles.filterBar}>
                  {["newest", "votes"].map((f) => (
                    <button
                      key={f}
                      style={{
                        ...styles.filterButton,
                        fontWeight: filteranswer === f ? "bold" : "normal",
                      }}
                      onClick={() => {
                        setFilterAnswer(f);
                        setShowAllAnswers(false);
                      }}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <ul style={styles.list}>
                {answers.map((a) => (
                  <li
                    key={a.id}
                    style={{ ...styles.questionRow, cursor: "pointer" }}
                    onClick={() => handleQuestionClick(a.question_id)}
                  >
                    <div
                      style={{
                        ...styles.voteBox,
                        backgroundColor:
                          a.vote_score > 0
                            ? "#2e7d32"
                            : a.vote_score < 0
                              ? "#c62828"
                              : "#003366",
                      }}
                    >
                      {a.vote_score}
                    </div>
                    <div
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "530px",
                        overflow: "hidden",
                        flex: 1, // cho phép title co giãn
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {renderWithLatex(a.content)}
                    </div>

                    <div
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "0.9em",
                        color: "#666",
                        minWidth: "90px",
                        textAlign: "right",
                      }}
                    >
                      {new Date(a.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </li>
                ))}
              </ul>

              {showAllAnswers && (
                <div style={styles.modalOverlay}>
                  <div style={styles.modalContent}>
                    <div style={styles.modalHeader}>
                      <h3 style={{ margin: 0 }}>All Answers</h3>
                      <button
                        onClick={() => setShowAllAnswers(false)}
                        style={styles.closeButton}
                      >
                        ✕
                      </button>
                    </div>
                    <ul style={styles.list}>
                      {allAnswers.map((a) => (
                        <li
                          key={a.id}
                          style={{ ...styles.questionRow, cursor: "pointer" }}
                          onClick={() => handleQuestionClick(a.question_id)}
                        >
                          <div
                            style={{
                              ...styles.voteBox,
                              backgroundColor:
                                a.vote_score > 0
                                  ? "#2e7d32"
                                  : a.vote_score < 0
                                    ? "#c62828"
                                    : "#003366",
                            }}
                          >
                            {a.vote_score}
                          </div>
                          <div
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "530px",
                              overflow: "hidden",
                              flex: 1, // cho phép title co giãn
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            {renderWithLatex(a.content)}
                          </div>

                          <div
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "0.9em",
                              color: "#666",
                              minWidth: "90px",
                              textAlign: "right",
                            }}
                          >
                            {new Date(a.created_at).toLocaleDateString("vi-VN")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Thẻ</h3>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  style={styles.viewAllLink}
                  onClick={handleTagsAll} // Chỉ set showAllTags(true) để mở modal
                >
                  Xem tất cả thẻ
                </button>
              </div>

              <ul style={styles.list}>
                {tags.map((t) => (
                  <li
                    key={t.tag_id}
                    style={styles.questionRow}
                  >
                    <div
                      style={{
                        ...styles.voteBox,
                        backgroundColor:
                          t.total_vote_score > 0
                            ? "#2e7d32"
                            : t.total_vote_score < 0
                              ? "#c62828"
                              : "#003366",
                      }}
                    >
                      {t.total_vote_score}
                    </div>
                    <div style={styles.questionText}>{t.tag_name}</div>
                  </li>
                ))}
              </ul>

              {/* Modal hiển thị khi bấm vào "View all tags" */}
              {showAllTags && (
                <div style={styles.modalOverlay}>
                  <div style={styles.modalContent}>
                    <div style={styles.modalHeader}>
                      <h3 style={{ margin: 0 }}>All Tags</h3>
                      <button
                        onClick={handleCloseModal} // Đóng modal
                        style={styles.closeButton}
                      >
                        ✕
                      </button>
                    </div>
                    <ul style={styles.list}>
                      {tags.map((t) => (
                        <li
                          key={t.tag_id}
                          style={styles.questionRow}
                        >
                          <div
                            style={{
                              ...styles.voteBox,
                              backgroundColor:
                                t.total_vote_score > 0
                                  ? "#2e7d32"
                                  : t.total_vote_score < 0
                                    ? "#c62828"
                                    : "#003366",
                            }}
                          >
                            {t.total_vote_score}
                          </div>
                          <div style={styles.questionText}>{t.tag_name}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div style={styles.sidebarWrapper}>
            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Tổng quan</h3>
              <div style={styles.infoGrid}>
                <p>⭐ <strong>Điểm uy tín:</strong> {stats?.reputation}</p>
                <p>📈 <strong>Hạng:</strong> #{stats?.rank}</p>
                <p>💬 <strong>Câu trả lời:</strong> {stats?.total_answers}</p>
                <p>❓ <strong>Câu hỏi:</strong> {stats?.total_questions}</p>
              </div>
            </div>

            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Huy hiệu</h3>
              <div style={styles.badgesRow}>
                <div style={styles.badge}>
                  🥇<span>Gold</span>
                  <strong>0</strong>
                </div>
                <div style={styles.badge}>
                  🥈<span>Silver</span>
                  <strong>7</strong>
                </div>
                <div style={styles.badge}>
                  🥉<span>Bronze</span>
                  <strong>5</strong>
                </div>
              </div>
              <p>🥈 Silver: Yearling × 7</p>
              <p>🥉 Bronze: Teacher, Editor, Critic</p>
            </div>

            {voteStats ? (
              <div style={styles.sidebarBox}>
                <h3 style={styles.sectionTitle}>Lượt vote</h3>
                <div style={styles.infoGrid}>
                  <p>🔼 <strong>Lượt upvote:</strong> {voteStats.upvotes}</p>
                  <p>🔽 <strong>Lượt downvote:</strong> {voteStats.downvotes}</p>
                  <p>❓ <strong>Vote câu hỏi:</strong> {voteStats.question_votes}</p>
                  <p>💬 <strong>Vote câu trả lời:</strong> {voteStats.answer_votes}</p>
                </div>
              </div>
            ) : (
              <p>Đang tải thống kê votes...</p>
            )}
          </div>
        </div>
      </div>
  );
}
const styles = {
  pageLayout: {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  maxWidth: "1300px",    // Giới hạn độ rộng tối đa
  width: "100%",         // Nhưng vẫn responsive
  margin: "40px auto",   // Canh giữa màn hình, 40px top-bottom
  padding: "0 20px",     // Thêm padding ngang để không sát màn hình
  color: "#003366",
},
  topBox: {
    display: "flex",
    gap: "20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    alignItems: "flex-start",
  },
  avatarIcon: {
    fontSize: "60px",
    lineHeight: "60px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  aboutBox: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontStyle: "italic",
  },
  bottomLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },
  mainContent: {
    flex: 2,
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  sidebarWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sidebarBox: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "4px",
  },
  badgesRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
  },
  badge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "16px",
    minWidth: "80px",
    textAlign: "center",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 30px",
    marginBottom: "20px",
  },
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  // ✅ Bổ sung cho phần hiển thị câu hỏi
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  questionRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  voteBox: {
    minWidth: "32px",
    height: "32px",
    backgroundColor: "#2e7d32",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },
  questionText: {
    flexGrow: 1,
    fontSize: "14px",
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  questionDate: {
    fontSize: "13px",
    color: "#666",
    marginLeft: "12px",
    whiteSpace: "nowrap",
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxWidth: '600px',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    maxHeight: '80vh',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  closeButton: {
    fontSize: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888',
  },
  viewAllLink: {
    background: "none",
    border: "none",
    color: "#0077cc",        // Màu giống link
    textDecoration: "underline",  // Gạch chân giống link
    cursor: "pointer",       // Con trỏ tay khi hover
    padding: 0,
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: "normal"
  },
};

export default StudentProfileForum;

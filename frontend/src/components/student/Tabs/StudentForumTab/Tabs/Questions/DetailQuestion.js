import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";
import { useNavigate } from "react-router-dom";

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userVoteQuestion, setUserVoteQuestion] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
        setUserName(user.username || "Người dùng ẩn danh");
      } catch (err) {
        console.error("❌ Invalid token");
      }
    }
  }, []);

  // Lấy dữ liệu câu hỏi và danh sách câu trả lời
  useEffect(() => {
    // Lấy câu hỏi
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/")
      .then((res) => res.json())
      .then((data) => {
        const selectedQuestion = data.find((q) => q.id.toString() === id);
        if (selectedQuestion) {
          setQuestion(selectedQuestion);
        }
      });

    // Lấy câu trả lời
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const token = getToken();
        let localUserId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            localUserId = payload.user_id;
          } catch (err) {
            console.error("❌ Token decode error", err);
          }
        }

        const formattedAnswers = data.map((ans) => {
        const voteKey = `answer_vote_${ans.id}-${localUserId}`;
        const storedVote = localStorage.getItem(voteKey);
        const userVote = storedVote ? parseInt(storedVote, 10) : 0;
        return {
          id: ans.id,
          username: ans.username,
          content: ans.content,
          created_at: ans.created_at,
          userVote,
          like: ans.like, // ✅ thêm
          dislike: ans.dislike, // ✅ thêm
          totalVote: ans.totalVote, // ✅ thêm
        };
      });


        setAnswers(formattedAnswers);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy dữ liệu câu trả lời:", error);
      });
  }, [id]);

  // Lấy trạng thái vote của người dùng cho câu hỏi
  useEffect(() => {
    if (userId) {
      const voteKey = `question_vote_${id}-${userId}`;
      const storedVote = localStorage.getItem(voteKey);
      setUserVoteQuestion(storedVote ? parseInt(storedVote, 10) : 0);
    }
  }, [id, userId]);

  // Xử lý vote
  const handleVote = (action, type = "question", contentId = null) => {
    if (!userId) return;
  
    const voteKey = `${type}_vote_${contentId}-${userId}`;
    const isLike = action === "like";
  
    const currentVote =
      type === "question"
        ? userVoteQuestion
        : answers.find((a) => a.id === contentId)?.userVote || 0;
  
    let newVote = 0;
    if (currentVote === 1 && isLike) newVote = 0;
    else if (currentVote === -1 && !isLike) newVote = 0;
    else newVote = isLike ? 1 : -1;
  
    localStorage.setItem(voteKey, newVote.toString());
  
    if (type === "question") {
      setQuestion((prev) => {
        if (!prev) return prev;
  
        let updatedLike = prev.like;
        let updatedDislike = prev.dislike;
  
        if (currentVote === 1) updatedLike -= 1;
        else if (currentVote === -1) updatedDislike -= 1;
  
        if (newVote === 1) updatedLike += 1;
        else if (newVote === -1) updatedDislike += 1;
  
        return {
          ...prev,
          like: updatedLike,
          dislike: updatedDislike,
          totalVote: updatedLike - updatedDislike,
        };
      });
  
      setUserVoteQuestion(newVote);
    } else {
      setAnswers((prevAnswers) =>
        prevAnswers.map((ans) => {
          if (ans.id !== contentId) return ans;
  
          let updatedLike = ans.like;
          let updatedDislike = ans.dislike;
  
          if (currentVote === 1) updatedLike -= 1;
          else if (currentVote === -1) updatedDislike -= 1;
  
          if (newVote === 1) updatedLike += 1;
          else if (newVote === -1) updatedDislike += 1;
  
          return {
            ...ans,
            userVote: newVote,
            like: updatedLike,
            dislike: updatedDislike,
            totalVote: updatedLike - updatedDislike,
          };
        })
      );
    }
  
    const token = getToken();
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vote_type: isLike ? "like" : "dislike",
        vote_for: type,
        content_id: contentId,
      }),
    }).then(() => {
      // Sau khi gửi vote thành công, tải lại câu hỏi và câu trả lời từ server
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/`)
        .then((res) => res.json())
        .then((data) => {
          const selectedQuestion = data.find((q) => q.id.toString() === id);
          if (selectedQuestion) {
            setQuestion(selectedQuestion);
          }
        });
  
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const formattedAnswers = data.map((ans) => {
            const voteKey = `answer_vote_${ans.id}-${userId}`;
            const storedVote = localStorage.getItem(voteKey);
            const userVote = storedVote ? parseInt(storedVote, 10) : 0;
            return {
              id: ans.id,
              username: ans.username,
              content: ans.content,
              created_at: ans.created_at,
              userVote,
              like: ans.like,
              dislike: ans.dislike,
              totalVote: ans.totalVote,
            };
          });
          setAnswers(formattedAnswers);
        });
    }).catch((error) => console.error("❌ Error during vote:", error));
  };
  
  

  // Xử lý gửi câu trả lời
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
  
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để đăng câu trả lời.");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user_id = payload.user_id;
  
      const answerData = {
        question_id: parseInt(id),
        user_id: user_id,
        content: newAnswer.trim(),
      };
  
      const response = await fetch("http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answerData),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Response không ok:", errText);
        throw new Error("Gửi câu trả lời thất bại.");
      }
  
      const result = await response.json();
  
      const newAns = {
        id: result.id,
        username: userName,
        content: newAnswer,
        created_at: new Date().toISOString(),
        userVote: 0,
      };
  
      const voteKey = `answer_vote_${newAns.id}-${user_id}`;
      localStorage.setItem(voteKey, "0");
  
      setAnswers((prev) => [newAns, ...prev]);
      setNewAnswer("");
      alert("Đăng câu trả lời thành công!");
  
      // Sau khi đăng câu trả lời mới, tải lại danh sách câu trả lời
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const formattedAnswers = data.map((ans) => {
            const voteKey = `answer_vote_${ans.id}-${userId}`;
            const storedVote = localStorage.getItem(voteKey);
            const userVote = storedVote ? parseInt(storedVote, 10) : 0;
            return {
              id: ans.id,
              username: ans.username,
              content: ans.content,
              created_at: ans.created_at,
              userVote,
              like: ans.like,
              dislike: ans.dislike,
              totalVote: ans.totalVote,
            };
          });
          setAnswers(formattedAnswers);
        });
    } catch (error) {
      console.error("❌ Lỗi khi gửi câu trả lời:", error);
      alert("Đăng câu trả lời thất bại. Vui lòng thử lại sau.");
    }
  };
  
    

  if (!question) return <p>Đang tải dữ liệu...</p>;

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
      <div style={questionContainerStyle}>
        <div style={questionContentStyle}>
          <h2>{question.title}</h2>
          <div style={metaContainerStyle}>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => handleVote("like", "question", question.id)}
                style={{
                  ...voteButton,
                  backgroundColor: userVoteQuestion === 1 ? "#003366" : "#eee",
                  color: userVoteQuestion === 1 ? "#fff" : "#000",
                }}
              >
                👍
              </button>
              <button
                onClick={() => handleVote("dislike", "question", question.id)}
                style={{
                  ...voteButton,
                  backgroundColor: userVoteQuestion === -1 ? "#003366" : "#eee",
                  color: userVoteQuestion === -1 ? "#fff" : "#000",
                }}
              >
                👎
              </button>
            </div>
            <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
            <span>
              🔖 {question.tags?.length ? question.tags.join(", ") : "No tags"}
            </span>
          </div>

          <p>{question.content}</p>

          {/* Thông tin thêm về câu hỏi */}
          <div style={containerSelectStyle}>
            <div style={topRowStyle}>
              <div style={buttonGroupStyle}>
                <button style={actionButtonStyle}>↗️ Chia sẻ</button>
                <button
                  style={actionButtonStyle}
                  onClick={() =>
                    navigate("/studentforum/question/askquestion", {
                      state: { question: question }, // 👈 truyền object câu hỏi
                    })
                  }
                >
                  ✏️ Chỉnh sửa
                </button>
                <button style={actionButtonStyle}>👁️ Theo dõi</button>
              </div>

              {/* 👇 Chỗ hiển thị thời gian chỉnh sửa */}
              <span>
                {question.created_at ? (
                  (() => {
                    const updatedAt = new Date(question.created_at);
                    if (isNaN(updatedAt.getTime())) return "⛔ Invalid updated_at";

                    const now = new Date();
                    const diffInSeconds = Math.floor((now - updatedAt) / 1000);
                    if (diffInSeconds < 60) return "Vừa xong";

                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    return `Đã chỉnh sửa ${diffInMinutes} phút trước`;
                  })()
                ) : (
                  "⛔ Không có updated_at"
                )}
              </span>

            </div>

            {/* Nút thêm bình luận */}
            <div style={commentButtonContainerStyle}>
              <button style={commentButtonStyle}>💬 Thêm bình luận</button>
            </div>
          </div>
        </div>
      </div>


      <div style={answerContainer}>
        <label style={answerCountLabel}>
          Tổng số câu trả lời: {answers.length}
        </label>

        {answers.length > 0 ? (
          <ul>
            {answers.map((ans) => (
              <li key={ans.id} style={answerItemStyle}>
                <div style={singleAnswerBox}>
                  <p><strong>{ans.username}</strong></p>
                  <p>{ans.content}</p>

                  <div style={metaContainerStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleVote("like", "answer", ans.id)}
                        style={{
                          ...voteButton,
                          backgroundColor: ans.userVote === 1 ? "#003366" : "#eee",
                          color: ans.userVote === 1 ? "#fff" : "#000",
                        }}
                      >
                        👍
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: ans.userVote === 1 ? '#fff' : '#003366'
                        }}>
                          {ans.like}
                        </span>
                      </button>

                      <button
                        onClick={() => handleVote("dislike", "answer", ans.id)}
                        style={{
                          ...voteButton,
                          backgroundColor: ans.userVote === -1 ? "#003366" : "#eee",
                          color: ans.userVote === -1 ? "#fff" : "#000",
                        }}
                      >
                        👎
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: ans.userVote === -1 ? '#fff' : '#003366'
                        }}>
                          {ans.dislike}
                        </span>
                      </button>

                      <span>📊 <strong>Vote:</strong> {ans.totalVote}</span>
                    </div>

                    <span>🕒 {new Date(ans.created_at).toLocaleString()}</span>
                  </div>

                  {/* Khung chia sẻ, chỉnh sửa, theo dõi, bình luận riêng cho từng câu trả lời */}
                  <div style={{ ...containerSelectStyle, marginTop: '10px' }}>
                    <div style={topRowStyle}>
                      <div style={buttonGroupStyle}>
                        <button style={actionButtonStyle}>↗️ Chia sẻ</button>
                        <button style={actionButtonStyle}>✏️ Chỉnh sửa</button>
                        <button style={actionButtonStyle}>👁️ Theo dõi</button>
                      </div>
                      <span>Đã chỉnh sửa 1 p trước</span>
                    </div>

                    <div style={commentButtonContainerStyle}>
                      <button style={commentButtonStyle}>💬 Thêm bình luận</button>
                    </div>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chưa có câu trả lời nào.</p>
        )}
      </div>

        {/* Khung nhập câu trả lời */}
        <div style={answerInputContainer}>
          <label htmlFor="answer" style={answerCountLabel}>Câu trả lời của bạn:</label>
          <textarea
            id="answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            style={textAreaStyle}
            placeholder="Nhập câu trả lời của bạn tại đây..."
          />
          <button style={submitButtonStyle} onClick={handlePostAnswer}>
            Đăng câu trả lời
          </button>
        </div>
      </div>
    </StudentForumLayout>
  );
}

// CSS styles
const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "160px",
  width: "1020px",
  color: "#003366",
};

const questionContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  display: "flex",
  marginBottom: "20px",
};

const voteButton = {
  padding: "4px 8px",
  fontSize: "16px",
  border: "1px solid #99ccff",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

const questionContentStyle = {
  flex: 1,
};

const metaContainerStyle = {
  fontSize: "14px",
  color: "#003366",
  marginBottom: "10px",
  display: "flex",
  gap: "30px",
  alignItems: "center",
  flexWrap: "wrap",
};

const answerContainer = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "20px",
};

const answerCountLabel = {
  fontWeight: "bold",
  fontSize: "16px",
  marginBottom: "10px",
  display: "block",
};

const answerItemStyle = {
  marginBottom: "15px",
  listStyle: "none",
};

const singleAnswerBox = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "10px 100px",
  backgroundColor: "#f0f8ff",
  width: "120%",
  maxWidth: "985px",
  boxSizing: "border-box",
  marginLeft: "-4%", // DỊCH TRÁI
};


const answerInputContainer = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const textAreaStyle = {
  width: "97.5%",
  height: "200px",
  borderRadius: "6px",
  border: "2px solid #003366",
  padding: "10px",
  fontSize: "16px",
  display: "block",     // đảm bảo là block-level
  margin: "0 auto",     // 👈 căn giữa theo chiều ngang
};

const submitButtonStyle = {
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  display: "block",
  marginTop:"15px",
};
const containerSelectStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
};

const actionButtonStyle = {
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};


const commentButtonContainerStyle = {
  textAlign: "left",
  marginTop: "16px",
};

const commentButtonStyle = {
  backgroundColor: "#e0e0e0",
  color: "#003366",
  border: "1px solid #ccc",
  padding: "8px 126px",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
};
export default StudentForumQuestionDetail;

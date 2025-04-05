import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";
import { getToken } from '../../../../../auth/authHelper';

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState(0); // Lưu trữ vote của câu hỏi
  const [votes_ans, setVotes_ans] = useState(0); // Lưu trữ vote của câu trả lời
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: "Đây là câu trả lời mẫu.",
      created_at: "2025-04-02T12:00:00Z",
    },
  ]);

  useEffect(() => {
  // Lấy câu hỏi
  fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/`)
    .then((response) => response.json())
    .then((data) => {
      const selectedQuestion = data.find((q) => q.id.toString() === id);
      if (selectedQuestion) {
        setQuestion(selectedQuestion);
      }
    });

  // Lấy câu trả lời
  fetch(`http://localhost:8000/api/student/student_forum/student_question/${id}/answers/`)
    .then((response) => response.json())
    .then((data) => setAnswers(data));

  // Lấy votes từ student_detailquestion
  fetch(`http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.votes !== undefined) {
        setVotes(data.votes); // Cập nhật votes câu hỏi
      }
      if (data && data.answers && data.answers.length > 0 && data.answers[0].votes !== undefined) {
        setVotes_ans(data.answers[0].votes); // Cập nhật votes câu trả lời
      }
    });
}, [id]);


  if (!question) return <p>Đang tải dữ liệu...</p>;

  const handleVote = (type, action) => {
    console.log("handleVote called with:", { type, action }); // Log khi hàm được gọi

    // Kiểm tra nếu đã vote lên hoặc vote xuống rồi thì không làm gì cả
    if (type === "question") {
      if (action === "up" && votes === 1) return; // Nếu đã vote lên, không cho phép tăng thêm
      if (action === "down" && votes === -1) return; // Nếu đã vote xuống, không cho phép giảm thêm
    } else if (type === "answer") {
      if (action === "up" && votes_ans === 1) return; // Nếu đã vote lên cho câu trả lời, không cho phép tăng thêm
      if (action === "down" && votes_ans === -1) return; // Nếu đã vote xuống cho câu trả lời, không cho phép giảm thêm
    }

    const voteType = action === "up" ? "like" : "dislike";
    const contentType = type === "question" ? "question" : "answer";
    const contentId = type === "question" ? question.id : answers[0]?.id; // Giả sử bạn đang xử lý một câu trả lời tại một thời điểm
  
    const voteData = {
      vote_type: voteType,
      vote_for: contentType,
      content_id: contentId,
    };
  
    const token = getToken(); // Lấy token từ hàm getToken()
  
    console.log("Sending vote data:", voteData); // Log dữ liệu vote
    console.log("Token:", token); // Log token
  
    fetch('http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Thêm token vào header
      },
      body: JSON.stringify(voteData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Vote response:", data); // Log phản hồi từ API
        if (data.success) {
          if (type === "question") {
            setVotes((prevVotes) => prevVotes + (action === "up" ? 1 : -1));
          } else if (type === "answer") {
            setVotes_ans((prevVotesAns) => prevVotesAns + (action === "up" ? 1 : -1));
          }
        } else {
          console.error("Vote failed:", data); // Log lỗi nếu vote không thành công
        }
      })
      .catch((error) => console.error("Error during vote:", error)); // Log lỗi khi gửi vote
  };

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        {/* Chi tiết câu hỏi */}
        <div style={questionContainerStyle}>
          <div style={voteContainer}>
            <button
              style={voteButton}
              onClick={() => handleVote("question", "up")}
              disabled={votes === 1} // Nếu vote là 1, không thể tăng thêm
            >
              ⬆
            </button>
            <span style={voteCount}>{votes}</span>
            <button
              style={voteButton}
              onClick={() => handleVote("question", "down")}
              disabled={votes === -1} // Nếu vote là -1, không thể giảm thêm
            >
              ⬇
            </button>
          </div>
          <div style={questionContentStyle}>
            <h2>{question.title}</h2>
            <div style={metaContainerStyle}>
              <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
              <span>🔖 {question.tags && question.tags.length > 0 ? question.tags.join(", ") : "No tags"}</span>
            </div>
            <p>{question.content}</p>
          </div>
        </div>

        {/* Khung câu trả lời */}
        <div style={answerContainer}>
          <label style={answerCountLabel}>Tổng số câu trả lời: {answers.length}</label>
          {answers.length > 0 ? (
            <ul>
              {answers.map((ans) => (
                <li key={ans.id} style={answerItemStyle}>
                  <div style={voteContainer}>
                    <button
                      style={voteButton}
                      onClick={() => handleVote("answer", "up")}
                      disabled={votes_ans === 1} // Nếu vote là 1, không thể tăng thêm
                    >
                      ⬆
                    </button>
                    <span style={voteCount}>{votes_ans}</span>
                    <button
                      style={voteButton}
                      onClick={() => handleVote("answer", "down")}
                      disabled={votes_ans === -1} // Nếu vote là -1, không thể giảm thêm
                    >
                      ⬇
                    </button>
                  </div>
                  <div style={answerContentStyle}>
                    <p>{ans.content}</p>
                    <span>🕒 {new Date(ans.created_at).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có câu trả lời nào.</p>
          )}
        </div>
      </div>
    </StudentForumLayout>
  );
}

const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "160px",
  width: "1020px",
};

const questionContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
};

const voteContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: "20px",
};

const voteButton = {
  fontSize: "40px",
  cursor: "pointer",
  border: "none",
  background: "none",
  color: "#003366",
};

const voteCount = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#003366",
};

const questionContentStyle = {
  flex: 1,
  fontSize: "16px",
  color: "#003366",
};

const answerContainer = {
  backgroundColor: "#ffffff",
  padding: "20px 40px 30px 0px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const metaContainerStyle = {
  display: "flex",
  justifyContent: "flex-begin",
  fontSize: "16px", // Giảm font size
  marginBottom: "10px",
  gap: "15px",
};

const answerCountLabel = { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#003366", marginLeft: "40px" };
const answerItemStyle = { display: "flex", marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" };
const answerContentStyle = { flex: 1 };

export default StudentForumQuestionDetail;

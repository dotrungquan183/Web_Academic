import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userVoteQuestion, setUserVoteQuestion] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/")
      .then((res) => res.json())
      .then((data) => {
        const selectedQuestion = data.find((q) => q.id.toString() === id);
        if (selectedQuestion) {
          setQuestion(selectedQuestion);
        }
      });

    fetch(`http://localhost:8000/api/student/student_forum/student_question/${id}/answers/`)
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
      });
  }, [id]);

  useEffect(() => {
    if (userId) {
      const voteKey = `question_vote_${id}-${userId}`;
      const storedVote = localStorage.getItem(voteKey);
      if (storedVote !== null) {
        setUserVoteQuestion(parseInt(storedVote, 10));
      } else {
        setUserVoteQuestion(0);
      }
    }
  }, [id, userId]);

  if (!question) return <p>Đang tải dữ liệu...</p>;

  const handleVote = (action) => {
    if (!userId) return;

    const voteKey = `question_vote_${id}-${userId}`;
    const isLike = action === "like";
    const currentVote = userVoteQuestion;

    let newVote = 0;
    if (currentVote === 1 && isLike) {
      newVote = 0; // Bỏ like
    } else if (currentVote === -1 && !isLike) {
      newVote = 0; // Bỏ dislike
    } else {
      newVote = isLike ? 1 : -1; // Đổi sang like hoặc dislike
    }

    setUserVoteQuestion(newVote);
    localStorage.setItem(voteKey, newVote.toString());

    let vote_type = null;

  if (currentVote === 1 && isLike) {
    vote_type = "like"; // Gửi like lại để backend xóa
  } else if (currentVote === -1 && !isLike) {
    vote_type = "dislike"; // Gửi dislike lại để backend xóa
  } else {
    vote_type = isLike ? "like" : "dislike"; // Gửi vote mới hoặc đổi loại vote
  }
    const voteData = {
      vote_type,
      vote_for: "question",
      content_id: question.id,
    };

    const token = getToken();
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(voteData),
    }).catch((error) => console.error("Error during vote:", error));
  };

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        <div style={questionContainerStyle}>
          <div style={questionContentStyle}>
            <h2>{question.title}</h2>
            <div style={metaContainerStyle}>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => handleVote("like")}
                  style={{
                    ...voteButton,
                    backgroundColor: userVoteQuestion === 1 ? "#003366" : "#eee",
                    color: userVoteQuestion === 1 ? "#fff" : "#000",
                  }}
                >
                  👍
                </button>
                <button
                  onClick={() => handleVote("dislike")}
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
              <span>🔖 {question.tags && question.tags.length > 0 ? question.tags.join(", ") : "No tags"}</span>
            </div>
            <p>{question.content}</p>
          </div>
        </div>

        <div style={answerContainer}>
          <label style={answerCountLabel}>Tổng số câu trả lời: {answers.length}</label>
          {answers.length > 0 ? (
            <ul>
              {answers.map((ans) => (
                <li key={ans.id} style={answerItemStyle}>
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
};

const answerCountLabel = {
  fontWeight: "bold",
  fontSize: "16px",
  marginBottom: "10px",
  display: "block",
};

const answerItemStyle = {
  display: "flex",
  marginBottom: "15px",
};

const answerContentStyle = {
  marginLeft: "15px",
  flex: 1,
};

export default StudentForumQuestionDetail;

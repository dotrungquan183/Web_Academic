import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState(0);
  const [votes_ans, setVotes_ans] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userVoteQuestion, setUserVoteQuestion] = useState(null);
  const [userVoteAnswer, setUserVoteAnswer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/")
      .then((res) => res.json())
      .then((data) => {
        const selectedQuestion = data.find((q) => q.id.toString() === id);
        if (selectedQuestion) {
          setQuestion(selectedQuestion);
          setUserVoteQuestion(selectedQuestion.user_vote);
        }
      });

    fetch(`http://localhost:8000/api/student/student_forum/student_question/${id}/answers/`)
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        if (data.length > 0) {
          setUserVoteAnswer(data[0].user_vote);
        }
      });

    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.total_vote_score !== undefined) {
          setVotes(data.total_vote_score);
        }
      });
  }, [id]);

  useEffect(() => {
    const storedVote = localStorage.getItem(`question_vote_${id}`);
    if (storedVote !== null) {
      setUserVoteQuestion(parseInt(storedVote, 10));
    } else {
      setUserVoteQuestion(0);
    }
  }, [id]);

  if (!question) return <p>Đang tải dữ liệu...</p>;

  const handleVote = (type, action) => {
    let updatedVotes = 0;

    if (type === "question") {
      if (action === "up" && userVoteQuestion !== 1) {
        if (userVoteQuestion === -1) {
          updatedVotes = votes + 1;
          setVotes(updatedVotes);
          setUserVoteQuestion(0);
          localStorage.setItem(`question_vote_${id}`, "0");
        } else {
          updatedVotes = votes + 1;
          setVotes(updatedVotes);
          setUserVoteQuestion(1);
          localStorage.setItem(`question_vote_${id}`, "1");
        }
      } else if (action === "down" && userVoteQuestion !== -1) {
        if (userVoteQuestion === 1) {
          updatedVotes = votes - 1;
          setVotes(updatedVotes);
          setUserVoteQuestion(0);
          localStorage.setItem(`question_vote_${id}`, "0");
        } else {
          updatedVotes = votes - 1;
          setVotes(updatedVotes);
          setUserVoteQuestion(-1);
          localStorage.setItem(`question_vote_${id}`, "-1");
        }
      }
    } else if (type === "answer") {
      if (action === "up" && userVoteAnswer !== 1) {
        if (userVoteAnswer === -1) {
          updatedVotes = votes_ans + 1;
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(0);
        } else {
          updatedVotes = votes_ans + 1;
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(1);
        }
      } else if (action === "down" && userVoteAnswer !== -1) {
        if (userVoteAnswer === 1) {
          updatedVotes = votes_ans - 1;
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(0);
        } else {
          updatedVotes = votes_ans - 1;
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(-1);
        }
      }
    }

    const voteType = action === "up" ? "like" : "dislike";
    const contentType = type === "question" ? "question" : "answer";
    const contentId = type === "question" ? question.id : answers[0]?.id;

    const voteData = {
      vote_type: voteType,
      vote_for: contentType,
      content_id: contentId,
    };

    const token = getToken();

    fetch("http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(voteData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error("Vote failed:", data);
        }
      })
      .catch((error) => console.error("Error during vote:", error));
  };

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        <div style={questionContainerStyle}>
          <div style={voteContainer}>
            <button style={voteButton} onClick={() => handleVote("question", "up")} disabled={userVoteQuestion === 1}>
              ⬆
            </button>
            <span style={voteCount}>{votes}</span>
            <button style={voteButton} onClick={() => handleVote("question", "down")} disabled={userVoteQuestion === -1}>
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

        <div style={answerContainer}>
          <label style={answerCountLabel}>Tổng số câu trả lời: {answers.length}</label>
          {answers.length > 0 ? (
            <ul>
              {answers.map((ans) => (
                <li key={ans.id} style={answerItemStyle}>
                  <div style={voteContainer}>
                    <button style={voteButton} onClick={() => handleVote("answer", "up")} disabled={userVoteAnswer === 1}>
                      ⬆
                    </button>
                    <span style={voteCount}>{votes_ans}</span>
                    <button style={voteButton} onClick={() => handleVote("answer", "down")} disabled={userVoteAnswer === -1}>
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
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  display: "flex",
  marginBottom: "20px",
};

const voteContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: "15px",
};

const voteButton = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const voteCount = {
  fontSize: "18px",
  margin: "5px 0",
};

const questionContentStyle = {
  flex: 1,
};

const metaContainerStyle = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "10px",
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

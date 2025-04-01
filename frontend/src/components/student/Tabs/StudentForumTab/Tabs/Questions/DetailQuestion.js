import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState(0);
  const [votes_ans, setVotes_ans] = useState(0);
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: "Đây là câu trả lời mẫu.",
      created_at: "2025-04-02T12:00:00Z",
    },
  ]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/`)
      .then((response) => response.json())
      .then((data) => {
        const selectedQuestion = data.find((q) => q.id.toString() === id);
        if (selectedQuestion) {
          setQuestion(selectedQuestion);
        }
      });

    fetch(`http://localhost:8000/api/student/student_forum/student_question/${id}/answers/`)
      .then((response) => response.json())
      .then((data) => setAnswers(data));
  }, [id]);

  if (!question) return <p>Đang tải dữ liệu...</p>;

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        {/* Chi tiết câu hỏi */}
        <div style={questionContainerStyle}>
          <div style={voteContainer}>
            <button style={voteButton} onClick={() => setVotes(votes + 1)}>⬆</button>
            <span style={voteCount}>{votes}</span>
            <button style={voteButton} onClick={() => setVotes(votes - 1)}>⬇</button>
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
                    <button style={voteButton} onClick={() => setVotes_ans(votes_ans + 1)}>⬆</button>
                    <span style={voteCount}>{votes_ans}</span>
                    <button style={voteButton} onClick={() => setVotes_ans(votes_ans - 1)}>⬇</button>
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
    marginBottom: "10px" , 
    gap: "15px",
  };  
const answerCountLabel = { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#003366", marginLeft:"40px" };
const answerItemStyle = { display: "flex", marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" };
const answerContentStyle = { flex: 1 };

export default StudentForumQuestionDetail;

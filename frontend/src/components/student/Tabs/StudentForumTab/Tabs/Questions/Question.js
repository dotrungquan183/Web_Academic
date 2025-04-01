import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentForumLayout from "../../Layout";

function StudentForumQuestion() {
  const [data, setData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("Newest");
  const [bountyFilter, setBountyFilter] = useState("Bountied");
  const [interestFilter, setInterestFilter] = useState("Trending");
  const [qualityFilter, setQualityFilter] = useState("Interesting");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setData(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]);
      });
  }, []);

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "#003366" }}>Câu hỏi</h2>
          <button 
            style={askButtonStyle} 
            onClick={() => navigate("/studentforum/question/askquestion")}
          >
            Đặt câu hỏi
          </button>
        </div>
        <div style={contentStyle}>
          <div style={questionCountStyle}>
            Tổng số câu hỏi: {data ? data.length : "..."}
          </div>
          <div style={filterContainerStyle}>
            <div style={filterBoxStyle}>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={dropdownStyle}>
                <option value="Newest">Newest</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
              <select value={bountyFilter} onChange={(e) => setBountyFilter(e.target.value)} style={dropdownStyle}>
                <option value="Bountied">Bountied</option>
              </select>
              <select value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)} style={dropdownStyle}>
                <option value="Trending">Trending</option>
                <option value="Hot">Hot</option>
                <option value="Frequent">Frequent</option>
                <option value="Active">Active</option>
              </select>
              <select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)} style={dropdownStyle}>
                <option value="Interesting">Interesting</option>
                <option value="Score">Score</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div style={questionListStyle}>
        {data === null ? (
          <p>Đang tải dữ liệu...</p>
        ) : data.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {data.map((question) => (
              <li 
                key={question.id} 
                style={questionContainerStyle} 
                onClick={() => navigate(`/studentforum/question/${question.id}`)}>
                <div style={questionContentStyle}>
                  <h3>{question.title}</h3>
                  
                </div>
                <div style={questionMetaStyle}>
                  <span>👀 {question.views || 0}</span>
                  <span>👍 {question.votes || 0}</span>
                  <span>💬 {question.answers || 0}</span>
                  <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
                  <span>🔖 {question.tags && question.tags.length > 0 ? question.tags.join(", ") : "No tags"}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có câu hỏi nào.</p>
        )}
      </div>
    </StudentForumLayout>
  );
}

// 🎨 Styling
const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "160px",
  height: "135px",
  width: "1020px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const askButtonStyle = {
  backgroundColor: "#003366",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const contentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const questionCountStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#003366",
};

const filterContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const filterBoxStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "8px",
};

const dropdownStyle = {
  padding: "6px",
  borderRadius: "4px",
  border: "1px solid #003366",
  cursor: "pointer",
  width: "100%",
  minWidth: "120px",
  backgroundColor: "#003366",
  color: "white",
};

const questionListStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "20px",
  maxHeight: "500px",
  overflowY: "auto",
  width: "1010px",
  marginLeft: "160px",
};

const questionContainerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "15px",
  cursor: "pointer",
};

const questionContentStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#003366",
  marginBottom: "10px",
};

const questionMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  color: "#666",
};

export default StudentForumQuestion;

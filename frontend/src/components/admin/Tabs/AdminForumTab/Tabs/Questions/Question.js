import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminForumLayout from "../../Layout";
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../../../../../auth/authHelper';

function AdminForumQuestion() {
  const [data, setData] = useState(null);
  const [votesMap, setVotesMap] = useState({});
  const [answersMap, setAnswersMap] = useState({});
  const [timeFilter, setTimeFilter] = useState("");
  const [bountyFilter, setBountyFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const navigate = useNavigate();
  const handleApprove = (id) => {
    console.log("Approved question:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected question:", id);
  };
  const fetchQuestions = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (timeFilter) params.append("time", timeFilter);
      if (bountyFilter) params.append("bounty", bountyFilter);
      if (interestFilter) params.append("interest", interestFilter);
      if (qualityFilter) params.append("quality", qualityFilter);

      const response = await fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/?${params.toString()}`);
      const result = await response.json();
      const formattedData = Array.isArray(result) ? result : result ? [result] : [];
      setData(formattedData);

      const votesResults = {};
      const answersResults = {};

      await Promise.all(formattedData.map(async (q) => {
        try {
          const res = await fetch(`http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/${q.id}/`);
          const detail = await res.json();

          if (detail.total_vote_score !== undefined) {
            votesResults[q.id] = detail.total_vote_score;
          }

          if (detail.total_answers !== undefined) {
            answersResults[q.id] = detail.total_answers;
          }
        } catch (err) {
          console.error(`Error fetching detail for question ${q.id}:`, err);
        }
      }));

      setVotesMap(votesResults);
      setAnswersMap(answersResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  }, [timeFilter, bountyFilter, interestFilter, qualityFilter]);

  // ✅ useEffect không còn warning nữa
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <AdminForumLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "#003366" }}>Câu hỏi</h2>
        </div>
        <div style={contentStyle}>
          <div style={questionCountStyle}>
            Tổng số câu hỏi: {data ? data.length : "Đang tải..."}
          </div>
          <div style={filterContainerStyle}>
            <div style={filterBoxStyle}>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={dropdownStyle}>
                <option value="All">All</option>
                <option value="Newest">Newest</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
              <select value={bountyFilter} onChange={(e) => setBountyFilter(e.target.value)} style={dropdownStyle}>
                <option value="All">All</option>
                <option value="Bountied">Bountied</option>
              </select>
              <select value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)} style={dropdownStyle}>
                <option value="All">All</option>
                <option value="Trending">Trending</option>
                <option value="Hot">Hot</option>
                <option value="Frequent">Frequent</option>
                <option value="Active">Active</option>
              </select>
              <select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)} style={dropdownStyle}>
                <option value="All">All</option>
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
                style={{ ...questionContainerStyle, position: "relative" }} // thêm position: relative
                onClick={async () => {
                  const token = getToken();
                  let userId = null;

                  if (token) {
                    try {
                      const decoded = jwtDecode(token);
                      userId = decoded.user_id;
                    } catch (error) {
                      console.error("Token không hợp lệ:", error);
                    }
                  }

                  if (!userId) {
                    console.error("User chưa đăng nhập hoặc token không hợp lệ.");
                    return;
                  }

                  try {
                    await fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        question_id: question.id,
                        user_id: userId,
                      }),
                    });
                  } catch (err) {
                    console.error("Lỗi khi cập nhật view:", err);
                  }

                  navigate(`/adminforum/question/${question.id}`);
                }}
              >
                {/* Nút duyệt và từ chối */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    display: "flex",
                    gap: "6px",
                    zIndex: 1,
                  }}
                  onClick={(e) => e.stopPropagation()} // tránh trigger navigate khi click nút
                >
                  <button
                    onClick={() => handleApprove(question.id)}
                    style={{
                      backgroundColor: "green",
                      border: "none",
                      borderRadius: "50%",
                      color: "white",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Duyệt câu hỏi"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleReject(question.id)}
                    style={{
                      backgroundColor: "red",
                      border: "none",
                      borderRadius: "50%",
                      color: "white",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Từ chối / Xóa câu hỏi"
                  >
                    ✕
                  </button>
                </div>

                {/* Nội dung câu hỏi */}
                <div style={questionContentStyle}>
                  <h3>{question.title}</h3>
                </div>
                <div style={questionMetaStyle}>
                  <span>👤 {question.username}</span>
                  <span>👀 {question.views || 0}</span>
                  <span>👍 {votesMap[question.id] ?? 0}</span>
                  <span>💬 {answersMap[question.id] ?? 0} câu trả lời</span>
                  <span>
                    🕒 {new Date(question.created_at).toLocaleDateString()},&nbsp;
                    {new Date(question.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  <span>🔖 {question.tags?.length > 0 ? question.tags.join(", ") : "No tags"}</span>
                  <span>💰 {question.bounty_amount || 0}</span>
                </div>
              </li>

            ))}
          </ul>
        ) : (
          <p>Không có câu hỏi nào.</p>
        )}
      </div>
    </AdminForumLayout>
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
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, auto))",  // 6 cột tương ứng 6 span
  gap: "10px",  // khoảng cách giữa các cột
  fontSize: "14px",
  color: "#666",
  alignItems: "center",  // thêm dòng này
  lineHeight: "1.4",
};

export default AdminForumQuestion;

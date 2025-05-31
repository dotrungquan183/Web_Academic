import React, { useEffect, useState } from "react";
import AdminForumLayout from "../Layout";

function AdminForumTag() {
  const [data, setData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("Newest");
  const [bountyFilter, setBountyFilter] = useState("Bountied");
  const [interestFilter, setInterestFilter] = useState("Active");
  const [qualityFilter, setQualityFilter] = useState("Score");

  useEffect(() => {
    fetch("http://localhost:8000/api/teacher/teacher_forum/teacher_tag/")
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
    <AdminForumLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "#003366" }}>Câu hỏi</h2>
          <button style={askButtonStyle}>Đặt câu hỏi</button>
        </div>
        <div style={contentStyle}>
          <div style={questionCountStyle}>
            Tổng số câu hỏi: {data ? data.length : "..."}
          </div>
          <div style={filterContainerStyle}>
            <div style={filterBoxStyle}>
              <style>{globalStyle}</style>
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
            {data.map((question) => {
              let contentText = "Nội dung không hợp lệ";
              if (typeof question.content === "string") {
                contentText = question.content.split(",").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ));
              } else if (Array.isArray(question.content)) {
                contentText = question.content.map((line, index) => (
                  <span key={index}>
                    {String(line)}
                    <br />
                  </span>
                ));
              } else if (question.content && typeof question.content === "object") {
                contentText = <pre>{JSON.stringify(question.content, null, 2)}</pre>;
              }

              return (
                <li key={question.id} style={questionItemStyle}>
                  <p>{contentText}</p>
                </li>
              );
            })}
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
  marginLeft:"160px",
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

// CSS global để xử lý hiệu ứng hover
const globalStyle = `
  select option {
    background-color: white !important;
    color: #003366 !important;
  }

  select:hover, select:focus {
    background-color: #003366 !important;
    color: white !important;
    border-color: #003366 !important;
  }

  select option:hover {
    background-color: #003366 !important;
    color: white !important;
  }
`;

const questionListStyle = {
  backgroundColor: "#ffffff",
  padding: "20px", // Giảm padding để hiển thị đẹp hơn
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "20px",
  maxHeight: "500px",
  overflowY: "auto", // Thêm thanh cuộn nếu quá nhiều câu hỏi
  width: "1010px",
  marginLeft: "160px",
};

const questionItemStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  fontSize: "16px",
  lineHeight: "1.5",
};

export default AdminForumTag;

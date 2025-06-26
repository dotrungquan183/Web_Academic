import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminForumLayout from "../../Layout";

function AdminForumTag() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchTags = (filter) => {
    setLoading(true);
    fetch(`http://localhost:8000/api/admin/admin_forum/admin_tag/admin_show_tags/?filter=${filter}`)
      .then((response) => response.json())
      .then((res) => {
        const tags = Array.isArray(res.tags) ? res.tags : [];
        setData(tags);
        setFilteredData(tags);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi fetch:", error);
        setData([]);
        setFilteredData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTags(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const filtered = data.filter((tag) =>
      tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <AdminForumLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "#003366" }}>Chủ đề</h2>
          <div style={topControlsStyle}>
            <div style={searchContainerStyle}>
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
              <span style={searchIconStyle}>🔍</span>
            </div>
            <div style={filterButtonGroupStyle}>
              <button
                style={activeFilter === "All" ? askButtonStyle : inactiveButtonStyle}
                onClick={() => setActiveFilter("All")}
              >
                Tất cả
              </button>
              <button
                style={activeFilter === "Popular" ? askButtonStyle : inactiveButtonStyle}
                onClick={() => setActiveFilter("Popular")}
              >
                Phổ biến
              </button>
              <button
                style={activeFilter === "Newest" ? askButtonStyle : inactiveButtonStyle}
                onClick={() => setActiveFilter("Newest")}
              >
                Mới nhất
              </button>
            </div>
          </div>
          <div style={{ color: "#003366", fontWeight: "bold", marginTop: "10px" }}>
            Số chủ đề tìm thấy: {filteredData.length}
          </div>
        </div>
      </div>

      <div style={tagListStyle}>
        {loading ? (
          <p style={{ marginLeft: "160px" }}>Đang tải dữ liệu...</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((tag, index) => {
            const alternatingStyle = {
              backgroundColor: index % 2 === 0 ? "#003366" : "#ffffff",
              color: index % 2 === 0 ? "#ffffff" : "#003366",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer",
              transition: "transform 0.2s",
            };

            return (
              <div
                key={tag.id}
                style={alternatingStyle}
                onClick={() => navigate(`/adminforum/tag/${tag.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3>{tag.tag_name}</h3>
                <p><strong>Tổng câu hỏi:</strong> {tag.total_questions}</p>
                <p><strong>Hôm nay:</strong> {tag.questions_today}</p>
                <p><strong>Tuần này:</strong> {tag.questions_this_week}</p>
              </div>
            );
          })
        ) : (
          <p style={{ marginLeft: "160px" }}>Không có dữ liệu.</p>
        )}
      </div>
    </AdminForumLayout>
  );
}

export default AdminForumTag;

// === Style ===
const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "160px",
  height: "auto",
  width: "1020px",
};

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const topControlsStyle = {
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

const inactiveButtonStyle = {
  backgroundColor: "white",
  color: "#003366",
  border: "1px solid #003366",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const filterButtonGroupStyle = {
  display: "flex",
  gap: "10px",
};

const searchContainerStyle = {
  position: "relative",
};

const searchInputStyle = {
  padding: "8px 35px 8px 12px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "15px",
  width: "250px",
};

const searchIconStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "16px",
  color: "#003366",
  pointerEvents: "none",
};

const tagListStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "20px",
  maxHeight: "500px",
  overflowY: "auto",
  width: "1010px",
  marginLeft: "160px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

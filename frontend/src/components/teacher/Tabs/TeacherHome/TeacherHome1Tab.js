import React, { useEffect, useState } from "react";

function TeacherHome1() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const url = "https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml";

      try {
        const response = await fetch(url);
        const data = await response.json();
        setNews(data.items);  // Dữ liệu tin tức trong RSS sẽ có ở phần `items`
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f3f4f6" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color:"#003366" }}>TIN TỨC</h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Kiểm tra nếu đang tải dữ liệu */}
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          news.map((article, index) => (
            <div
              key={index}
              style={{
                flex: "1 1 30%",
                margin: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onClick={() => window.open(article.link, "_blank")} // Mở liên kết tin tức trong cửa sổ mới
            >
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{article.title}</h3>
              <p style={{ color: "#555" }}>{article.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherHome1;

import React from "react";
import StudentProfileLayout from "../Layout";

const styles = {
  pageLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    margin: "40px 160px",
    color: "#003366",
  },
  topBox: {
    display: "flex",
    gap: "20px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    alignItems: "flex-start",
  },
  avatarIcon: {
    fontSize: "60px",
    lineHeight: "60px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  aboutBox: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontStyle: "italic",
  },
  bottomLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },
  mainContent: {
    flex: 2,
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  sidebarWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sidebarBox: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "4px",
  },
  badgesRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
  },
  badge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "16px",
    minWidth: "80px",
    textAlign: "center",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 30px",
    marginBottom: "20px",
  },
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};

const StudentProfileForum = () => {
  return (
    <StudentProfileLayout>
      <div style={styles.pageLayout}>
        {/* Top Section */}
        <div style={styles.topBox}>
          <div style={styles.avatarIcon}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={styles.userInfo}>
              <h2 style={{ fontSize: "28px", marginBottom: "5px" }}>Jakobian</h2>
              <p>Thành viên đã tham gia 7 năm, 8 tháng</p>
              <p>Trạng thái cuối cùng: hơn một tuần trước</p>
            </div>
            <div style={styles.aboutBox}>
              "Less is more, but less is also less. Perchance?"
            </div>
          </div>
        </div>

        {/* Bottom Layout */}
        <div style={styles.bottomLayout}>
          {/* Main Content (Right side) */}
          <div style={styles.mainContent}>
            {/* Reputation */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Danh tiếng</h3>
              </div>
              <div style={styles.card}>
                <div style={styles.reputationItem}>
                  <div style={{ color: "red", display: "inline-block", marginRight: "10px", fontWeight: "bold" }}>-4</div>
                  <div style={{ display: "inline-block" }}>
                    Làm thế nào để tìm một hàm
                  </div>
                </div>
                <div style={styles.reputationItem}>
                  <div style={{ color: "green", display: "inline-block", marginRight: "10px", fontWeight: "bold" }}>+10</div>
                  <div style={{ display: "inline-block" }}>
                    Hàm đặc trưng của tích của hai biến ngẫu nhiên với phân phối chuẩn tùy ý
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Câu hỏi</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={styles.viewAllLink}>Xem tất cả 97 câu hỏi</button>
                <div style={styles.filterBar}>
                  <button style={styles.filterButton}>Điểm</button>
                  <button style={{ ...styles.filterButton, fontWeight: "bold" }}>Hoạt động</button>
                  <button style={styles.filterButton}>Mới nhất</button>
                  <button style={styles.filterButton}>Lượt xem</button>
                </div>
              </div>
              <ul style={styles.list}>
                <li>-2 — Làm thế nào để tìm một hàm f... (1 giờ trước)</li>
                <li>9 — Tính ∫₀ ln(...) dx (Sep 17, 2024)</li>
                <li>1 — Tính lim ∫γR (Apr 10)</li>
                <li>0 — Xác định xem một đường thẳng có... (Feb 24)</li>
                <li>1 — Chứng minh tính cộng của... (Aug 9, 2024)</li>
              </ul>
            </div>

            {/* Answers */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Câu trả lời</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={styles.viewAllLink}>Xem tất cả 23 câu trả lời</button>
                <div style={styles.filterBar}>
                  <button style={{ ...styles.filterButton, fontWeight: "bold" }}>Điểm</button>
                  <button style={styles.filterButton}>Hoạt động</button>
                  <button style={styles.filterButton}>Mới nhất</button>
                </div>
              </div>
              <ul style={styles.list}>
                <li>5 — Đánh giá lim... (Oct 22, 2024)</li>
                <li>3 — Định lý geodesic (Jul 12, 2024)</li>
                <li>3 — Tìm tích phân bằng phương pháp hình thang (Dec 5, 2024)</li>
                <li>3 — Cho α và β là... (Dec 29, 2024)</li>
                <li>2 — Chứng minh tích phân... (Sep 16, 2024)</li>
              </ul>
            </div>

            {/* Tags */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Thẻ</h3>
                <button>Xem tất cả 81 thẻ</button>
              </div>
              <ul style={styles.tagList}>
                <li><strong>real-analysis</strong> — 8 điểm — 13 bài viết</li>
                <li><strong>limits</strong> — 6 điểm — 10 bài viết</li>
                <li><strong>integration</strong> — 5 điểm — 11 bài viết</li>
                <li><strong>analysis</strong> — 4 điểm — 3 bài viết</li>
              </ul>
            </div>
          </div>

          {/* Sidebar (right) */}
          <div style={styles.sidebarWrapper}>
            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Thống kê</h3>
              <div style={styles.infoGrid}>
                <p>⭐ <strong>Danh tiếng:</strong> 14,361</p>
                <p>📈 <strong>Xếp hạng:</strong> #48</p>
                <p>💬 <strong>Câu trả lời:</strong> 1</p>
                <p>❓ <strong>Câu hỏi:</strong> 0</p>
              </div>
            </div>

            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Huy hiệu</h3>
              <div style={styles.badgesRow}>
                <div style={styles.badge}>
                  🥇<span>Vàng</span>
                  <strong>0</strong>
                </div>
                <div style={styles.badge}>
                  🥈<span>Bạc</span>
                  <strong>7</strong>
                </div>
                <div style={styles.badge}>
                  🥉<span>Đồng</span>
                  <strong>5</strong>
                </div>
              </div>
              <p>🥈 Bạc: Yearling × 7</p>
              <p>🥉 Đồng: Giáo viên, Biên tập viên, Phê bình</p>
            </div>

            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Phiếu bầu</h3>
              <div style={styles.infoGrid}>
                <p>🔼 <strong>Lên phiếu:</strong> 201</p>
                <p>🔽 <strong>Xuống phiếu:</strong> 34</p>
                <p>❓ <strong>Phiếu câu hỏi:</strong> 67</p>
                <p>💬 <strong>Phiếu câu trả lời:</strong> 168</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentProfileLayout>
  );
};

export default StudentProfileForum;

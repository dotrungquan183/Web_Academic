import React from "react";
import StudentProfileLayout from "../Layout";

const styles = {
  pageLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    margin: "40px 20px 100px 100px",
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
              <p>Member for 7 years, 8 months</p>
              <p>Last seen: more than a week ago</p>
            </div>
            <div style={styles.aboutBox}>
              "Less is more, but less is also less. Perchance?"
            </div>
          </div>
        </div>
  
        {/* Bottom Layout */}
        <div style={styles.bottomLayout}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Reputation */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Reputation</h3>
              </div>
              <div style={styles.card}>
                <div style={styles.reputationItem}>
                  <div style={{ color: "red", display: "inline-block", marginRight: "10px", fontWeight: "bold" }}>-4</div>
                  <div style={{ display: "inline-block" }}>
                    How to find a function
                  </div>
                </div>
                <div style={styles.reputationItem}>
                  <div style={{ color: "green", display: "inline-block", marginRight: "10px", fontWeight: "bold" }}>+10</div>
                  <div style={{ display: "inline-block" }}>
                    Characteristic function of product of two arbitrarily normal-distributed random variables
                  </div>
                </div>
              </div>
            </div>
  
            {/* Questions */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Questions</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={styles.viewAllLink}>View all 97 questions</button>
                <div style={styles.filterBar}>
                  <button style={styles.filterButton}>Score</button>
                  <button style={{ ...styles.filterButton, fontWeight: "bold" }}>Activity</button>
                  <button style={styles.filterButton}>Newest</button>
                  <button style={styles.filterButton}>Views</button>
                </div>
              </div>
              <ul style={styles.list}>
                <li>-2 — How to find a function f... (1 hour ago)</li>
                <li>9 — Evaluate ∫₀ ln(...) dx (Sep 17, 2024)</li>
                <li>1 — Compute lim ∫γR (Apr 10)</li>
                <li>0 — Determine whether a line... (Feb 24)</li>
                <li>1 — Prove the additivity of... (Aug 9, 2024)</li>
              </ul>
            </div>
  
            {/* Answers */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Answers</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={styles.viewAllLink}>View all 23 answers</button>
                <div style={styles.filterBar}>
                  <button style={{ ...styles.filterButton, fontWeight: "bold" }}>Score</button>
                  <button style={styles.filterButton}>Activity</button>
                  <button style={styles.filterButton}>Newest</button>
                </div>
              </div>
              <ul style={styles.list}>
                <li>5 — Evaluate lim... (Oct 22, 2024)</li>
                <li>3 — Geodesic theorem (Jul 12, 2024)</li>
                <li>3 — Compute integral using trapezoidal method (Dec 5, 2024)</li>
                <li>3 — Let α and β be... (Dec 29, 2024)</li>
                <li>2 — Prove the integral... (Sep 16, 2024)</li>
              </ul>
            </div>
  
            {/* Tags */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Tags</h3>
                <button>View all 81 tags</button>
              </div>
              <ul style={styles.tagList}>
                <li><strong>real-analysis</strong> — 8 score — 13 posts</li>
                <li><strong>limits</strong> — 6 score — 10 posts</li>
                <li><strong>integration</strong> — 5 score — 11 posts</li>
                <li><strong>analysis</strong> — 4 score — 3 posts</li>
              </ul>
            </div>
          </div>
  
          {/* Sidebar */}
          <div style={styles.sidebarWrapper}>
            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Stats</h3>
              <div style={styles.infoGrid}>
                <p>⭐ <strong>Reputation:</strong> 14,361</p>
                <p>📈 <strong>Rank:</strong> #48</p>
                <p>💬 <strong>Answers:</strong> 1</p>
                <p>❓ <strong>Questions:</strong> 0</p>
              </div>
            </div>
  
            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Badges</h3>
              <div style={styles.badgesRow}>
                <div style={styles.badge}>
                  🥇<span>Gold</span>
                  <strong>0</strong>
                </div>
                <div style={styles.badge}>
                  🥈<span>Silver</span>
                  <strong>7</strong>
                </div>
                <div style={styles.badge}>
                  🥉<span>Bronze</span>
                  <strong>5</strong>
                </div>
              </div>
              <p>🥈 Silver: Yearling × 7</p>
              <p>🥉 Bronze: Teacher, Editor, Critic</p>
            </div>
  
            <div style={styles.sidebarBox}>
              <h3 style={styles.sectionTitle}>Votes</h3>
              <div style={styles.infoGrid}>
                <p>🔼 <strong>Upvotes:</strong> 201</p>
                <p>🔽 <strong>Downvotes:</strong> 34</p>
                <p>❓ <strong>Question votes:</strong> 67</p>
                <p>💬 <strong>Answer votes:</strong> 168</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentProfileLayout>
  );
}

export default StudentProfileForum;

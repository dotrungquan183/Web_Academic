import React from "react";

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

const FakeStackUserProfile = () => {
  return (
    <div style={styles.pageLayout}>
      {/* Top Section: User Info + About */}
      <div style={styles.topBox}>
        <div style={styles.avatarIcon}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={styles.userInfo}>
            <h2 style={{ fontSize: "28px", marginBottom: "5px" }}>Jakobian</h2>
            <p>Member for 7 years, 8 months</p>
            <p>Last seen more than a week ago</p>
          </div>
          <div style={styles.aboutBox}>
            "Less is more, but less is also less. Perchance?"
          </div>
        </div>
      </div>

      {/* Bottom Section: Main + Sidebar */}
      <div style={styles.bottomLayout}>
        {/* Main Content */}
        <div style={styles.mainContent}>
          <h3 style={styles.sectionTitle}>Stats</h3>
          <div style={styles.infoGrid}>
            <p>⭐ <strong>Reputation:</strong> 14,361</p>
            <p>📈 <strong>Ranking:</strong> #48 this quarter</p>
            <p>💬 <strong>Answers:</strong> 1</p>
            <p>❓ <strong>Questions:</strong> 0</p>
            <p>
              🌐 <strong>Communities:</strong><br />
              Mathematics (14.4k), MathOverflow (1.7k)
            </p>
          </div>

          <hr style={{ margin: "16px 0" }} />

          {/* Badges Section */}
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

        {/* Sidebar */}
        <div style={styles.sidebarWrapper}>
          <div style={styles.sidebarBox}>
            <div style={styles.sectionTitle}>Top Tags</div>
            <ul>
              <li>discussion (0)</li>
              <li>undeletion (0)</li>
              <li>re-open (0)</li>
              <li>big-list (0)</li>
            </ul>
          </div>

          <div style={styles.sidebarBox}>
            <div style={styles.sectionTitle}>Newest Posts</div>
            <div style={styles.filterBar}>
              <div style={styles.filterButton}>All</div>
              <div style={styles.filterButton}>Answers</div>
              <div style={styles.filterButton}>Questions</div>
              <div style={styles.filterButton}>Votes</div>
            </div>
            <p>Requests for Reopen & Undeletion Votes (June 25, 2024)</p>
          </div>

          <div style={styles.sidebarBox}>
            <div style={styles.sectionTitle}>Top Posts</div>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Are these figures homeomorphic? (47)</li>
              <li>Are βQ and β(βQ∖Q) homeomorphic? (22)</li>
              <li>Does ∑∞n=1|sin(n)|/n converge? (20)</li>
              <li>Example of a point not the limit of any sequence... (18)</li>
              <li>Zero distance between closed sets in metric space (15)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeStackUserProfile;

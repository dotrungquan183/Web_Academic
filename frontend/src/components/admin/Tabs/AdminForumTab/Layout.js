import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FiMenu } from "react-icons/fi";

function AdminForumLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      {isSidebarOpen && <Sidebar />}
      <div style={{ marginLeft: isSidebarOpen ? "220px" : "40px", padding: "20px", width: "100%" }}>
        <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuIcon}>
          <FiMenu size={24} />
        </div>
        {children}
      </div>
    </div>
  );
}

const styles = {
  menuIcon: {
    position: "absolute",
    top: "155px",
    left: "10px",
    cursor: "pointer",
    color: "#003366",
  },
};

export default AdminForumLayout;

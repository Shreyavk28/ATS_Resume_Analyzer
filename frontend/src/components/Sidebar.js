import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Enterprise ATS</h2>

      <Link to="/" style={styles.link}>Upload Center</Link>
      <Link to="/report" style={styles.link}>ATS Report</Link>
      <Link to="/recruiter" style={styles.link}>Recruiter Dashboard</Link>
    </div>
  );
}

const styles = {
  sidebar: {
      width: "250px",
  height: "100vh",

  background: "#0b2a45",
  color: "white",

  padding: "20px",

  position: "fixed"

  },
  logo: {
    marginBottom: "30px"
  },
  link: {
    display: "block",
    color: "white",
    textDecoration: "none",
    margin: "15px 0"
  }
};

export default Sidebar;

import React from "react";

export default function Upgrade() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "white",
      textAlign: "center",
      padding: "40px"
    }}>
      <div>
        <h1 style={{ fontSize: "64px", marginBottom: "20px" }}>
          🎉 FREE FOREVER 🎉
        </h1>

        <p style={{ fontSize: "22px", maxWidth: "650px", lineHeight: "1.6" }}>
          ResumeForge is built for students and learning.
          <br /><br />
          There is <b>no subscription</b>, <b>no payment</b>, and <b>no upgrade needed</b>.
          <br /><br />
          You can create <b>unlimited resumes for free forever.</b>
        </p>

        <a href="/builder">
          <button style={{
            marginTop: "30px",
            padding: "14px 28px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "white",
            color: "#764ba2",
            fontWeight: "bold"
          }}>
            Start Building Resume →
          </button>
        </a>
      </div>
    </div>
  );
}
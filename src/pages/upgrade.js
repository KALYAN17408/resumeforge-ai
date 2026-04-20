import React from "react";
import "./Upgrade.css";

export default function Upgrade() {
  return (
    <div className="upgrade-container">
      <div className="upgrade-card">
        <h1>🎉 ResumeForge AI is FREE Forever</h1>

        <p className="big-text">
          You do NOT need to upgrade.
        </p>

        <p className="sub-text">
          All resume templates are completely free.
          <br />
          Unlimited resumes. No subscriptions. No payments.
        </p>

        <div className="features">
          <div className="feature">✔ 17+ Classic Resume Templates</div>
          <div className="feature">✔ Unlimited Resume Downloads</div>
          <div className="feature">✔ Lifetime Free Access</div>
        </div>

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}
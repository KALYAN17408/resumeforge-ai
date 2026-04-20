import React from "react";

export default function Upgrade() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "40px"
    }}>
      <div>
        <h1 style={{fontSize:"42px", marginBottom:"20px"}}>
          🎉 No Upgrade Needed
        </h1>

        <p style={{fontSize:"20px", opacity:0.8}}>
          ResumeForge is now <b>FREE FOREVER</b>.
        </p>

        <p style={{marginTop:"10px", opacity:0.7}}>
          All resume templates and features are unlocked.
        </p>
      </div>
    </div>
  );
}
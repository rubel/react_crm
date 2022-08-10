import React from "react";

function AccessDeniedAnim({ children }) {
  var so = {
    body: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom right, #EEE, #AAA)",
    },

    h1: {
      margin: "40px 0 20px",
    },
  };

  return (
    <div style={so.body}>
      <div style={{ width: "200px", height: "200px", textAlign: "center" }}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="11em"
          width="11em"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v2H9V7zm9.002 13H13v-2.278c.595-.347 1-.985 1-1.722 0-1.103-.897-2-2-2s-2 .897-2 2c0 .736.405 1.375 1 1.722V20H6v-9h12l.002 9z"></path>
        </svg>
      </div>
      <div className="message">
        <h1 style={so.h1}>Access to this page is restricted</h1>
        <p style={{ textAlign: "center" }}>Please check with the site admin if you believe this is a mistake.</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default AccessDeniedAnim;

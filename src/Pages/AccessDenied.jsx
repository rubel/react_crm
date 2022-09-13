import React from "react";
import AccessDeniedAnim from "./AccessDeniedAnim";
function AccessDenied() {
  var host = window.location.host;
  return (
    <div>
      <AccessDeniedAnim>
        <a href={host}>Login</a>
      </AccessDeniedAnim>
    </div>
  );
}

export default AccessDenied;

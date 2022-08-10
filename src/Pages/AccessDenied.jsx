import React from "react";
import { LOGIN_URL } from "../Constants/AppConstants";
import AccessDeniedAnim from "./AccessDeniedAnim";
function AccessDenied() {
  return (
    <div>
      <AccessDeniedAnim>
        <a href={LOGIN_URL}>Login</a>
      </AccessDeniedAnim>
    </div>
  );
}

export default AccessDenied;

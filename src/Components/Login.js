import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { headers, SERVER_URL } from "../Constants/AppConstants";

export default function Login({ toggle }) {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("");
  const [msg, setMsg] = useState("");

  let history = useNavigate();

  const authenticateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        SERVER_URL + "crm/service.php",
        {
          uid: uid,
          password: password,
          func: "login",
        },
        {
          headers: headers,
        }
      );

      if (res.data == "login_failed") {
        setMsg("Wrong Userid/password");
      } else {
        sessionStorage.setItem("uid", uid);
        sessionStorage.setItem("fullUserDetails", JSON.stringify(res.data));
        setMsg("");

        toggle();

        history("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  var loggedIn = sessionStorage.getItem("uid");
  return (
    <div
      className="auth-wrapper"
      style={loggedIn ? { display: "none", height: "600px" } : { display: "flex", height: "600px" }}>
      <div className="auth-inner">
        <div className="container">
          <form>
            <h3>Sign In</h3>
            <div className="mb-3">
              <label>User Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="User Id"
                name="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3" style={{ color: "red" }}>
              <p className="has-text-centered">{msg}</p>
            </div>
            <div className="mb-3" style={{ display: "none" }}>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="custom-control-label" htmlFor="customCheck1" style={{ marginLeft: "8px" }}>
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" onClick={authenticateUser}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

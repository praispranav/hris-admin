import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userNameChange = (e) => setUsername(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/admin/login", { username, password });
      alert(data.message);
      localStorage.setItem('token', data.token)
      window.location.href = '/add'
    } catch (error) {
      alert("User Name Or password Is Invalid");
    }
  };
  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <form onSubmit={onSubmit}>
          <h4 className="display-6">Login</h4>
          <div className="input-group mt-2">
            <input
              type="text"
              value={username}
              placeholder="Username"
              className="form-control"
              onChange={userNameChange}
            />
          </div>
          <div className="input-group mt-2">
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="form-control"
              onChange={passwordChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm mt-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

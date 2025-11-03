import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", { username : email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/panel";
    } catch {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login</h2>
      <input type="text" placeholder="Username or Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
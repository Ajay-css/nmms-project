import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">NMMS Scanner</h1>
      <div className="links">
        <a href="/">Scan</a>
        <a href="/results">Results</a>
        <a href="/admin">Admin</a>
      </div>
    </nav>
  );
}

export default Navbar;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Scanner from "./components/Scanner";
import AdminPanel from "./components/AdminPanel";
import ResultsPage from "./components/ResultsPage";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
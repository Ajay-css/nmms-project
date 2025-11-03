import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ResultsPage.css";

function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:4000/api/results");
      setResults(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="results-container">
      <h2>📄 Scanned Results</h2>
      <div className="table">
        <div className="header">
          <span>Name</span>
          <span>MAT</span>
          <span>SAT</span>
          <span>Maths</span>
          <span>Science</span>
          <span>Social</span>
        </div>
        {results.map((r, i) => (
          <div key={i} className="row">
            <span>{r.name}</span>
            <span>{r.MAT}</span>
            <span>{r.SAT}</span>
            <span>{r.MATHS}</span>
            <span>{r.SCIENCE}</span>
            <span>{r.SOCIAL}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;
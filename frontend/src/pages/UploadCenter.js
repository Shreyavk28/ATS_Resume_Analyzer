import React, { useState } from "react";
import "./UploadCenter.css";

const UploadCenter = () => {

  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT: Use Render backend URL
  const API_URL = "https://ats-backend-re6q.onrender.com/api/upload/";

  const handleUpload = async () => {

    if (!file || !jobDesc) {
      alert("Please upload resume and job description");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    try {

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      console.log("ATS RESULT:", data);

      localStorage.setItem("ats_result", JSON.stringify(data));

      window.location.href = "/report";

    } catch (error) {

      console.error(error);

      alert("Backend error. Please check backend deployment.");

    }

    setLoading(false);
  };


  return (

    <div className="upload-container">

      <div className="upload-card">

        <div className="upload-header">

          <div className="upload-icon">📄</div>

          <div>
            <h2>Resume Upload Center</h2>
            <p>Upload candidate resume and job description to generate ATS score</p>
          </div>

        </div>

        <div className="upload-section">

          <label className="upload-label">
            Resume File
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <div className="file-name">
              Selected: {file.name}
            </div>
          )}

        </div>

        <div className="upload-section">

          <label className="upload-label">
            Job Description
          </label>

          <textarea
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

        </div>

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

        <div className="upload-footer">

          Supported formats: PDF  
          <br />
          AI will analyze skills, role match, and ATS score

        </div>

      </div>

    </div>

  );

};

export default UploadCenter;
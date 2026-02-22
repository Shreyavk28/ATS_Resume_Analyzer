import React, { useState } from "react";
import "./UploadCenter.css";

const UploadCenter = () => {

  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);


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

      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      localStorage.setItem("ats_result", JSON.stringify(data));

      window.location.href = "/report";

    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };


  return (

    <div className="upload-container">

      <div className="upload-card">


        {/* HEADER */}
        <div className="upload-header">

          <div className="upload-icon">📄</div>

          <div>
            <h2>Resume Upload Center</h2>
            <p>Upload candidate resume and job description to generate ATS score</p>
          </div>

        </div>


        {/* FILE UPLOAD */}
        <div className="upload-section">

          <label className="upload-label">
            Resume File
          </label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <div className="file-name">
              Selected: {file.name}
            </div>
          )}

        </div>


        {/* JOB DESCRIPTION */}
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


        {/* BUTTON */}
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>


        {/* FOOTER INFO */}
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
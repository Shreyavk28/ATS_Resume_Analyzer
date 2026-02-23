import React, { useState } from "react";
import "./UploadCenter.css";

const UploadCenter = () => {

  const [candidateName, setCandidateName] = useState("");
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Use environment variable
  const API_BASE = process.env.REACT_APP_API_BASE;


  const handleUpload = async () => {

    // ✅ prevent double click
    if (loading) return;

    // validation
    if (!candidateName.trim()) {
      alert("Please enter candidate name");
      return;
    }

    if (!file) {
      alert("Please upload resume file");
      return;
    }

    if (!jobDesc.trim()) {
      alert("Please enter job description");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", candidateName);
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    try {

      console.log("Sending request to:", `${API_BASE}/upload/`);

      const res = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {

        const text = await res.text();
        console.error("Server error:", text);

        throw new Error("Server error");
      }

      const data = await res.json();

      console.log("ATS Result:", data);

      // ✅ save result AND candidate name
      localStorage.setItem("ats_result", JSON.stringify({
        ...data,
        candidate_name: candidateName
      }));

      // redirect
      window.location.href = "/report";

    }
    catch (error) {

      console.error("Upload error:", error);

      alert(
        "Backend is starting. Please wait 30 seconds and try again."
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <div className="upload-container">

      <div className="upload-card">

        <div className="upload-header">

          <div className="upload-icon">📄</div>

          <div>
            <h2>Resume Upload Center</h2>
            <p>
              Upload candidate resume and job description to generate ATS score
            </p>
          </div>

        </div>


        {/* ✅ Candidate Name Input */}
        <div className="upload-section">

          <label className="upload-label">
            Candidate Name
          </label>

          <input
            type="text"
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />

        </div>


        {/* Resume upload */}
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


        {/* Job description */}
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


        {/* Submit button */}
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >

          {loading
            ? "Analyzing Resume... Please wait"
            : "Analyze Resume"
          }

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
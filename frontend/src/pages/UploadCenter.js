
import React, { useState } from "react";
import "./UploadCenter.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://ats-backend-re6q.onrender.com/api";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const UploadCenter = () => {
  const [candidateName, setCandidateName] = useState("");
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isAllowed) {
      alert("Please upload a PDF, DOC, or DOCX resume.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size must not exceed 10 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (loading) return;

    if (!candidateName.trim()) {
      alert("Please enter candidate name.");
      return;
    }

    if (!file) {
      alert("Please upload a resume in PDF, DOC, or DOCX format.");
      return;
    }

    if (!jobDesc.trim()) {
      alert("Please enter job description.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", candidateName.trim());
    formData.append("file", file);
    formData.append("job_description", jobDesc.trim());

    try {
      console.log("Sending request to:", `${API_BASE}/upload/`);

      const response = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Unable to analyze the resume.";

        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error ||
            errorData.detail ||
            errorData.message ||
            errorMessage;
        } catch {
          // The server may return a non-JSON error response.
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log("ATS Result:", data);

      localStorage.setItem(
        "ats_result",
        JSON.stringify({
          ...data,
          candidate_name: candidateName.trim(),
        })
      );

      window.location.href = "/report";
    } catch (error) {
      console.error("Upload error:", error);

      alert(
        error.message ||
          "Unable to connect to the backend. Please try again."
      );
    } finally {
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
              Upload a candidate resume and job description to generate an
              ATS score.
            </p>
          </div>
        </div>

        <div className="upload-section">
          <label className="upload-label" htmlFor="candidate-name">
            Candidate Name
          </label>

          <input
            id="candidate-name"
            type="text"
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(event) => setCandidateName(event.target.value)}
            disabled={loading}
          />
        </div>

        <div className="upload-section">
          <label className="upload-label" htmlFor="resume-file">
            Resume File
          </label>

          <input
            id="resume-file"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            disabled={loading}
          />

          {file && (
            <div className="file-name">
              Selected: {file.name} (
              {(file.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}

          <small>
            Maximum file size: 10 MB
          </small>
        </div>

        <div className="upload-section">
          <label className="upload-label" htmlFor="job-description">
            Job Description
          </label>

          <textarea
            id="job-description"
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(event) => setJobDesc(event.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing Resume... Please wait" : "Analyze Resume"}
        </button>

        <div className="upload-footer">
          Supported formats: PDF, DOC, DOCX
          <br />
          AI will analyze skills, role match, and ATS score.
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;


import React, { useRef, useState } from "react";
import "./ATSReport.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://ats-backend-re6q.onrender.com/api";

const ATSReport = () => {
  const reportRef = useRef();
  const [saving, setSaving] = useState(false);

  let data = null;

  try {
    const stored = localStorage.getItem("ats_result");
    data = stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Could not read saved ATS result:", error);
  }

  if (!data || typeof data !== "object") {
    return (
      <div className="ats-container">
        <div className="ats-card">
          <h2>No ATS Data Found</h2>
          <p>Please upload a resume and analyze it again.</p>
        </div>
      </div>
    );
  }

  const score = Math.max(
    0,
    Math.min(100, Number(data.ats_score) || 0)
  );

  const candidateName =
    data.candidate_name ||
    `${data.predicted_role || "Candidate"} Candidate`;

  const matchedSkills = Array.isArray(data.matched_skills)
    ? data.matched_skills
    : [];

  const missingSkills = Array.isArray(data.missing_skills)
    ? data.missing_skills.filter(
        (skill) => typeof skill === "string" && skill.trim()
      )
    : [];

  const getLevel = () => {
    if (score >= 80) return "Excellent Match";
    if (score >= 65) return "Good Match";
    if (score >= 50) return "Average Match";
    return "Needs Improvement";
  };

  const getDecision = () => {
    if (score >= 75) return "Strong Hire";
    if (score >= 60) return "Consider";
    return "Reject";
  };

  const getPercentile = () =>
    Math.min(99, Math.max(40, score + 15));

  const getScoreColor = () => {
    if (score >= 75) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const radialData = [{ score }];

  const roleData = Object.entries(data.role_scores || {}).map(
    ([role, value]) => ({
      role,
      score: Number(value) || 0
    })
  );

  // Generate prioritized, unique suggestions.
  const backendSuggestions = Array.isArray(data.suggestions)
    ? data.suggestions.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  const skillSuggestions = missingSkills.map(
    (skill) =>
      `Priority: Address the ${skill} requirement. If you have relevant experience, highlight it in your resume; otherwise, practise it through a relevant project.`
  );

  const generalSuggestions = [
    "Describe relevant projects by explaining the problem, your contribution, technologies used, and the outcome.",
    "Add measurable achievements where possible, such as time saved, performance improved, or users supported.",
    "Use clear section headings such as Skills, Projects, Education, and Experience, with simple ATS-friendly formatting."
  ];

  const normalizeSuggestion = (suggestion) =>
    suggestion.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const finalSuggestions = [];
  const seenSuggestions = new Set();

  [...skillSuggestions, ...backendSuggestions, ...generalSuggestions].forEach(
    (suggestion) => {
      const key = normalizeSuggestion(suggestion);

      if (key && !seenSuggestions.has(key)) {
        seenSuggestions.add(key);
        finalSuggestions.push(suggestion);
      }
    }
  );

  const saveCandidate = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/candidates/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: candidateName,
          score,
          role: data.predicted_role || "Unknown",
          matched_skills: matchedSkills,
          missing_skills: missingSkills,
          status: getDecision()
        })
      });

      if (!response.ok) {
        const message = await response.text();
        console.error("Save error:", message);
        throw new Error("Save failed");
      }

      alert("Candidate saved successfully!");
    } catch (error) {
      console.error("Could not save candidate:", error);
      alert(
        "Could not save the candidate. Please check your backend connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    try {
      if (!reportRef.current) return;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let remainingHeight = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`${candidateName.replace(/[<>:"/\\|?*]/g, "_")}_ATS_Report.pdf`);
    } catch (error) {
      console.error("PDF error:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="ats-container">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "flex-end",
          marginBottom: "20px"
        }}
      >
        <button className="download-btn" onClick={downloadPDF}>
          Download PDF
        </button>

        <button
          className="download-btn"
          onClick={saveCandidate}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Candidate"}
        </button>
      </div>

      <div ref={reportRef}>
        <h1 className="ats-title">ATS Report Dashboard</h1>

        <div className="ats-top-grid">
          <div className="ats-score-card">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                innerRadius="75%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="score"
                  fill={getScoreColor()}
                  cornerRadius={10}
                  background
                />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="score-overlay">
              <div className="ats-score-number">{score}%</div>
              <div className="score-level">{getLevel()}</div>
            </div>
          </div>

          <div className="ats-card summary-card">
            <div className="summary-row">
              <span>Candidate Name</span>
              <strong>{candidateName}</strong>
            </div>

            <div className="summary-row">
              <span>Predicted Role</span>
              <strong>{data.predicted_role || "Not determined"}</strong>
            </div>

            <div className="summary-row">
              <span>Hiring Decision</span>
              <strong className="badge">{getDecision()}</strong>
            </div>

            <div className="summary-row">
              <span>Candidate Percentile</span>
              <strong>Top {getPercentile()}%</strong>
            </div>

            <div className="summary-row">
              <span>Matched Skills</span>
              <strong>{matchedSkills.length}</strong>
            </div>
          </div>
        </div>

        <div className="ats-card full-width">
          <h3>Role Matching Analysis</h3>

          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <XAxis dataKey="role" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="score"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No role matching data available.</p>
          )}
        </div>

        <div className="ats-grid">
          <div className="ats-card">
            <h3>Matched Skills</h3>

            <div className="skills-list">
              {matchedSkills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="skill-item match">
                  ✓ {skill}
                </div>
              ))}

              {matchedSkills.length === 0 && (
                <p>No matched skills found.</p>
              )}
            </div>
          </div>

          <div className="ats-card">
            <h3>Missing Skills</h3>

            <div className="skills-list">
              {missingSkills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="skill-item missing">
                  ✗ {skill}
                </div>
              ))}

              {missingSkills.length === 0 && (
                <p>No missing skills detected.</p>
              )}
            </div>
          </div>
        </div>

        
<div className="ats-card ats-suggestions">
  <h3>Improvement Suggestions</h3>

  <p>
    Focus on these actions to improve alignment with the target role.
  </p>

  {(() => {
    const suggestions =
      data.suggestions?.length > 0
        ? data.suggestions
        : (data.missing_skills || []).map(
            (skill) =>
              `Address the ${skill} requirement. If you have relevant experience, highlight it in your resume; otherwise, practise it through a relevant project.`
          );

    return suggestions.length > 0 ? (
      suggestions.map((suggestion, index) => (
        <div className="suggestion-item" key={index}>
          <span className="suggestion-number">
            {index + 1}.
          </span>
          <span>{suggestion}</span>
        </div>
      ))
    ) : (
      <p>
        No specific suggestions available. Your resume aligns
        well with the selected job description.
      </p>
    );
  })()}
</div>

      </div>
    </div>
  );
};

export default ATSReport;

// import React, { useRef } from "react";
// import "./ATSReport.css";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   RadialBarChart,
//   RadialBar
// } from "recharts";

// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const ATSReport = () => {

//   const reportRef = useRef();

//   const data = JSON.parse(localStorage.getItem("ats_result"));

//   if (!data) {
//     return (
//       <div className="ats-container">
//         <div className="ats-card">
//           <h2>No ATS Data Found</h2>
//         </div>
//       </div>
//     );
//   }

//   const score = data.ats_score || 0;

//   /* ---------- LEVEL ---------- */
//   const getLevel = () => {
//     if (score >= 80) return "Excellent Match";
//     if (score >= 65) return "Good Match";
//     if (score >= 50) return "Average Match";
//     return "Needs Improvement";
//   };

//   /* ---------- DECISION ---------- */
//   const getDecision = () => {
//     if (score >= 75) return "Strong Hire";
//     if (score >= 60) return "Consider";
//     return "Reject";
//   };

//   /* ---------- PERCENTILE ---------- */
//   const getPercentile = () => {
//     return Math.min(99, Math.max(40, score + 15));
//   };

//   /* ---------- COLOR ---------- */
//   const getScoreColor = () => {
//     if (score >= 75) return "#10b981";
//     if (score >= 60) return "#f59e0b";
//     return "#ef4444";
//   };

//   const radialData = [{ score }];

//   const roleData = Object.entries(data.role_scores || {}).map(
//     ([role, value]) => ({
//       role,
//       score: value
//     })
//   );

//   /* ---------- PDF DOWNLOAD ---------- */
//   const downloadPDF = async () => {

//     const element = reportRef.current;

//     const canvas = await html2canvas(element, {
//       scale: 2
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgWidth = 210;
//     const imgHeight =
//       (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(
//       imgData,
//       "PNG",
//       0,
//       0,
//       imgWidth,
//       imgHeight
//     );

//     pdf.save("ATS_Report.pdf");
//   };



//   return (

//     <div className="ats-container">

//       {/* DOWNLOAD BUTTON */}
//       <button
//         className="download-btn"
//         onClick={downloadPDF}
//       >
//         Download PDF
//       </button>


//       <div ref={reportRef}>


//         {/* TITLE */}
//         <h1 className="ats-title">
//           ATS Report Dashboard
//         </h1>



//         {/* TOP GRID */}
//         <div className="ats-top-grid">


//           {/* SCORE CARD */}
//           <div className="ats-score-card">

//             <ResponsiveContainer width="100%" height={220}>

//               <RadialBarChart
//                 innerRadius="75%"
//                 outerRadius="100%"
//                 data={radialData}
//                 startAngle={90}
//                 endAngle={-270}
//               >

//                 <RadialBar
//                   dataKey="score"
//                   fill={getScoreColor()}
//                   cornerRadius={10}
//                 />

//               </RadialBarChart>

//             </ResponsiveContainer>


//             <div className="score-overlay">

//               <div className="ats-score-number">
//                 {score}%
//               </div>

//               <div className="score-level">
//                 {getLevel()}
//               </div>

//             </div>

//           </div>



//           {/* SUMMARY CARD */}
//           <div className="ats-card summary-card">

//             <div className="summary-row">
//               <span>Predicted Role</span>
//               <strong>
//                 {data.predicted_role}
//               </strong>
//             </div>


//             <div className="summary-row">
//               <span>Hiring Decision</span>
//               <strong className="badge">
//                 {getDecision()}
//               </strong>
//             </div>


//             <div className="summary-row">
//               <span>Candidate Percentile</span>
//               <strong>
//                 Top {getPercentile()}%
//               </strong>
//             </div>


//             <div className="summary-row">
//               <span>Matched Skills</span>
//               <strong>
//                 {data.matched_skills?.length || 0}
//               </strong>
//             </div>

//           </div>

//         </div>



//         {/* ROLE MATCH */}
//         <div className="ats-card full-width">

//           <h3>Role Matching Analysis</h3>

//           <ResponsiveContainer width="100%" height={300}>

//             <BarChart data={roleData}>

//               <XAxis dataKey="role"/>

//               <YAxis domain={[0,100]}/>

//               <Tooltip/>

//               <Bar
//                 dataKey="score"
//                 fill="#2563eb"
//                 radius={[8,8,0,0]}
//               />

//             </BarChart>

//           </ResponsiveContainer>

//         </div>



//         {/* SKILLS GRID */}
//         <div className="ats-grid">


//           {/* MATCHED */}
//           <div className="ats-card">

//             <h3>Matched Skills</h3>

//             <div className="skills-list">

//               {data.matched_skills?.map((skill, i) => (

//                 <div
//                   key={i}
//                   className="skill-item match"
//                 >
//                   ✓ {skill}
//                 </div>

//               ))}

//             </div>

//           </div>



//           {/* MISSING */}
//           <div className="ats-card">

//             <h3>Missing Skills</h3>

//             <div className="skills-list">

//               {data.missing_skills?.map((skill, i) => (

//                 <div
//                   key={i}
//                   className="skill-item missing"
//                 >
//                   ✗ {skill}
//                 </div>

//               ))}

//             </div>

//           </div>


//         </div>



//         {/* SUGGESTIONS */}
//         <div className="ats-card ats-suggestions">

//           <h3>Improvement Suggestions</h3>

//           {data.suggestions?.map((s, i) => (

//             <div
//               key={i}
//               className="suggestion-item"
//             >
//               {s}
//             </div>

//           ))}

//         </div>


//       </div>

//     </div>

//   );

// };

// export default ATSReport;













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

const ATSReport = () => {

  const reportRef = useRef();

  const [saving, setSaving] = useState(false);

  const data = JSON.parse(localStorage.getItem("ats_result"));

  if (!data) {
    return (
      <div className="ats-container">
        <div className="ats-card">
          <h2>No ATS Data Found</h2>
        </div>
      </div>
    );
  }

  const score = data.ats_score || 0;

  /* ---------- LEVEL ---------- */
  const getLevel = () => {

    if (score >= 80) return "Excellent Match";
    if (score >= 65) return "Good Match";
    if (score >= 50) return "Average Match";
    return "Needs Improvement";

  };

  /* ---------- DECISION ---------- */
  const getDecision = () => {

    if (score >= 75) return "Strong Hire";
    if (score >= 60) return "Consider";
    return "Reject";

  };

  /* ---------- PERCENTILE ---------- */
  const getPercentile = () => {

    return Math.min(99, Math.max(40, score + 15));

  };

  /* ---------- COLOR ---------- */
  const getScoreColor = () => {

    if (score >= 75) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";

  };

  const radialData = [{ score }];

  const roleData = Object.entries(data.role_scores || {}).map(
    ([role, value]) => ({
      role,
      score: value
    })
  );


  /* ---------- SAVE CANDIDATE TO DATABASE ---------- */

  const saveCandidate = async () => {

    try {

      setSaving(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/candidates/add/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: `${data.predicted_role} Candidate`,

            score: data.ats_score,

            role: data.predicted_role,

            matched_skills: data.matched_skills || [],

            missing_skills: data.missing_skills || [],

            status: getDecision()

          })
        }
      );

      if (!response.ok)
        throw new Error("Failed to save");

      alert("✅ Candidate saved to database");

    } catch (error) {

      console.error(error);

      alert("❌ Failed to save candidate");

    } finally {

      setSaving(false);

    }

  };


  /* ---------- PDF DOWNLOAD ---------- */

  const downloadPDF = async () => {

    const element = reportRef.current;

    const canvas = await html2canvas(element, {
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      imgWidth,
      imgHeight
    );

    pdf.save("ATS_Report.pdf");

  };



  return (

    <div className="ats-container">


      {/* TOP ACTION BUTTONS */}

      <div style={{
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
        marginBottom: "20px"
      }}>

        <button
          className="download-btn"
          onClick={downloadPDF}
        >
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


        {/* TITLE */}

        <h1 className="ats-title">
          ATS Report Dashboard
        </h1>



        {/* TOP GRID */}

        <div className="ats-top-grid">


          {/* SCORE CARD */}

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
                />

              </RadialBarChart>

            </ResponsiveContainer>


            <div className="score-overlay">

              <div className="ats-score-number">
                {score}%
              </div>

              <div className="score-level">
                {getLevel()}
              </div>

            </div>

          </div>



          {/* SUMMARY CARD */}

          <div className="ats-card summary-card">

            <div className="summary-row">
              <span>Predicted Role</span>
              <strong>
                {data.predicted_role}
              </strong>
            </div>


            <div className="summary-row">
              <span>Hiring Decision</span>
              <strong className="badge">
                {getDecision()}
              </strong>
            </div>


            <div className="summary-row">
              <span>Candidate Percentile</span>
              <strong>
                Top {getPercentile()}%
              </strong>
            </div>


            <div className="summary-row">
              <span>Matched Skills</span>
              <strong>
                {data.matched_skills?.length || 0}
              </strong>
            </div>

          </div>

        </div>



        {/* ROLE MATCH */}

        <div className="ats-card full-width">

          <h3>Role Matching Analysis</h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={roleData}>

              <XAxis dataKey="role"/>

              <YAxis domain={[0,100]}/>

              <Tooltip/>

              <Bar
                dataKey="score"
                fill="#2563eb"
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>



        {/* SKILLS GRID */}

        <div className="ats-grid">


          {/* MATCHED */}

          <div className="ats-card">

            <h3>Matched Skills</h3>

            <div className="skills-list">

              {data.matched_skills?.map((skill, i) => (

                <div
                  key={i}
                  className="skill-item match"
                >
                  ✓ {skill}
                </div>

              ))}

            </div>

          </div>



          {/* MISSING */}

          <div className="ats-card">

            <h3>Missing Skills</h3>

            <div className="skills-list">

              {data.missing_skills?.map((skill, i) => (

                <div
                  key={i}
                  className="skill-item missing"
                >
                  ✗ {skill}
                </div>

              ))}

            </div>

          </div>


        </div>



        {/* SUGGESTIONS */}

        <div className="ats-card ats-suggestions">

          <h3>Improvement Suggestions</h3>

          {data.suggestions?.map((s, i) => (

            <div
              key={i}
              className="suggestion-item"
            >
              {s}
            </div>

          ))}

        </div>


      </div>

    </div>

  );

};

export default ATSReport;
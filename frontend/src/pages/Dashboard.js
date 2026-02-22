// import React, { useState, useEffect } from "react";
// import "./Dashboard.css";

// const Dashboard = () => {

//   const [candidates, setCandidates] = useState([]);
//   const [sortOrder, setSortOrder] = useState("desc");

//   useEffect(() => {
//     try {

//       const stored = JSON.parse(localStorage.getItem("candidates"));

//       if (stored && Array.isArray(stored)) {
//         setCandidates(stored);
//       } else {
//         setCandidates([]);
//       }

//     } catch {
//       setCandidates([]);
//     }

//   }, []);

//   /* DECISION */
//   const getDecision = (score = 0) => {

//     if (score >= 75) return "Strong Hire";
//     if (score >= 60) return "Consider";
//     return "Reject";

//   };


//   /* ADD CURRENT ATS RESULT */
//   const addCurrentCandidate = () => {

//     const ats = JSON.parse(localStorage.getItem("ats_result"));

//     if (!ats) {
//       alert("Please analyze a resume first.");
//       return;
//     }

//     const newCandidate = {

//       id: Date.now(),

//       name: ats.predicted_role
//         ? `${ats.predicted_role} Candidate`
//         : `Candidate ${candidates.length + 1}`,

//       score: ats.ats_score || 0,

//       role: ats.predicted_role || "Unknown",

//       matched: ats.matched_skills?.length || 0,

//       missing: ats.missing_skills?.length || 0,

//       status: getDecision(ats.ats_score),

//       date: new Date().toLocaleString()

//     };

//     const updated = [...candidates, newCandidate];

//     setCandidates(updated);

//     localStorage.setItem("candidates", JSON.stringify(updated));

//   };


//   /* UPDATE STATUS */
//   const updateStatus = (id, newStatus) => {

//     const updated = candidates.map(candidate =>

//       candidate.id === id
//         ? { ...candidate, status: newStatus }
//         : candidate

//     );

//     setCandidates(updated);

//     localStorage.setItem("candidates", JSON.stringify(updated));

//   };


//   /* DELETE SINGLE */
//   const deleteCandidate = (id) => {

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this candidate?"
//     );

//     if (!confirmDelete) return;

//     const updated = candidates.filter(
//       candidate => candidate.id !== id
//     );

//     setCandidates(updated);

//     localStorage.setItem(
//       "candidates",
//       JSON.stringify(updated)
//     );

//   };


//   /* CLEAR ALL */
//   const clearAllCandidates = () => {

//     const confirmDelete = window.confirm(
//       "Delete ALL candidates?"
//     );

//     if (!confirmDelete) return;

//     localStorage.removeItem("candidates");

//     setCandidates([]);

//   };


//   /* SORT */
//   const sortedCandidates = [...candidates].sort((a, b) => {

//     const scoreA = a.score || 0;
//     const scoreB = b.score || 0;

//     return sortOrder === "desc"
//       ? scoreB - scoreA
//       : scoreA - scoreB;

//   });


//   /* COUNTS */
//   const strongCount =
//     candidates.filter(c => c.status === "Strong Hire").length;

//   const considerCount =
//     candidates.filter(c => c.status === "Consider").length;

//   const rejectCount =
//     candidates.filter(c => c.status === "Reject").length;


//   return (

//     <div className="dashboard-container">


//       {/* HEADER */}
//       <div className="dashboard-header">

//         <h1>Recruiter Dashboard</h1>

//         <div className="dashboard-actions">

//           {/* ADD */}
//           <button
//             className="add-btn"
//             onClick={addCurrentCandidate}
//           >
//             + Add Current Candidate
//           </button>


//           {/* CLEAR ALL */}
//           <button
//             className="clear-btn"
//             onClick={clearAllCandidates}
//           >
//             Clear All
//           </button>


//           {/* SORT */}
//           <select
//             className="sort-select"
//             value={sortOrder}
//             onChange={(e) =>
//               setSortOrder(e.target.value)
//             }
//           >

//             <option value="desc">
//               Highest Score First
//             </option>

//             <option value="asc">
//               Lowest Score First
//             </option>

//           </select>

//         </div>

//       </div>


//       {/* PIPELINE */}
//       <div className="pipeline">

//         <div className="pipeline-box strong">
//           Strong Hire
//           <span>{strongCount}</span>
//         </div>

//         <div className="pipeline-box consider">
//           Consider
//           <span>{considerCount}</span>
//         </div>

//         <div className="pipeline-box reject">
//           Reject
//           <span>{rejectCount}</span>
//         </div>

//       </div>


//       {/* EMPTY */}
//       {candidates.length === 0 && (

//         <div className="empty-state">

//           No candidates yet.

//           <br />

//           Upload resume → Analyze → Add Candidate

//         </div>

//       )}


//       {/* TABLE */}
//       {candidates.length > 0 && (

//         <table className="candidate-table">

//           <thead>

//             <tr>

//               <th>Name</th>
//               <th>ATS Score</th>
//               <th>Role</th>
//               <th>Matched</th>
//               <th>Missing</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Update</th>
//               <th>Delete</th>

//             </tr>

//           </thead>

//           <tbody>

//             {sortedCandidates.map(candidate => {

//               const statusSafe =
//                 candidate.status || "Reject";

//               const statusClass =
//                 statusSafe
//                   .toLowerCase()
//                   .replace(" ", "-");

//               return (

//                 <tr key={candidate.id}>

//                   <td>{candidate.name}</td>

//                   <td className="score">
//                     {candidate.score}%
//                   </td>

//                   <td>{candidate.role}</td>

//                   <td className="match">
//                     {candidate.matched}
//                   </td>

//                   <td className="missing">
//                     {candidate.missing}
//                   </td>

//                   <td>

//                     <span
//                       className={`status ${statusClass}`}
//                     >
//                       {statusSafe}
//                     </span>

//                   </td>

//                   <td>{candidate.date}</td>

//                   <td>

//                     <select

//                       value={statusSafe}

//                       onChange={(e) =>
//                         updateStatus(
//                           candidate.id,
//                           e.target.value
//                         )
//                       }

//                     >

//                       <option>
//                         Strong Hire
//                       </option>

//                       <option>
//                         Consider
//                       </option>

//                       <option>
//                         Reject
//                       </option>

//                     </select>

//                   </td>

//                   <td>

//                     <button
//                       className="delete-btn"
//                       onClick={() =>
//                         deleteCandidate(candidate.id)
//                       }
//                     >
//                       Delete
//                     </button>

//                   </td>

//                 </tr>

//               );

//             })}

//           </tbody>

//         </table>

//       )}

//     </div>

//   );

// };

// export default Dashboard;












import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const API_BASE = "http://127.0.0.1:8000/api";

const Dashboard = () => {

  const [candidates, setCandidates] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH FROM DATABASE ================= */

  const fetchCandidates = async () => {

    try {

      setLoading(true);

      const res = await fetch(`${API_BASE}/candidates/`);

      const data = await res.json();

      setCandidates(data);

    } catch (error) {

      console.error("Fetch error:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCandidates();

  }, []);


  /* ================= DECISION ================= */

  const getDecision = (score = 0) => {

    if (score >= 75) return "Strong Hire";
    if (score >= 60) return "Consider";
    return "Reject";

  };


  /* ================= ADD CURRENT ATS RESULT ================= */

  const addCurrentCandidate = async () => {

    const ats = JSON.parse(localStorage.getItem("ats_result"));

    if (!ats) {

      alert("Please analyze resume first");

      return;

    }

    try {

      await fetch(`${API_BASE}/candidates/add/`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          name: ats.predicted_role
            ? `${ats.predicted_role} Candidate`
            : "Candidate",

          score: ats.ats_score || 0,

          role: ats.predicted_role || "Unknown",

          matched_skills: ats.matched_skills || [],

          missing_skills: ats.missing_skills || [],

          status: getDecision(ats.ats_score)

        })

      });

      fetchCandidates();

    } catch (error) {

      console.error("Add error:", error);

    }

  };


  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, newStatus) => {

    try {

      await fetch(`${API_BASE}/candidates/${id}/update/`, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          status: newStatus
        })

      });

      fetchCandidates();

    } catch (error) {

      console.error("Update error:", error);

    }

  };


  /* ================= DELETE ================= */

  const deleteCandidate = async (id) => {

    const confirmDelete = window.confirm("Delete this candidate?");

    if (!confirmDelete) return;

    try {

      await fetch(`${API_BASE}/candidates/${id}/delete/`, {

        method: "DELETE"

      });

      fetchCandidates();

    } catch (error) {

      console.error("Delete error:", error);

    }

  };


  /* ================= SORT ================= */

  const sortedCandidates = [...candidates].sort((a, b) => {

    const scoreA = a.score || 0;
    const scoreB = b.score || 0;

    return sortOrder === "desc"
      ? scoreB - scoreA
      : scoreA - scoreB;

  });


  /* ================= COUNTS ================= */

  const strongCount =
    candidates.filter(c => c.status === "Strong Hire").length;

  const considerCount =
    candidates.filter(c => c.status === "Consider").length;

  const rejectCount =
    candidates.filter(c => c.status === "Reject").length;


  /* ================= UI ================= */

  return (

    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1>Recruiter Dashboard</h1>

        <div className="dashboard-actions">

          <button
            className="add-btn"
            onClick={addCurrentCandidate}
          >
            + Add Current Candidate
          </button>

          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >

            <option value="desc">
              Highest Score First
            </option>

            <option value="asc">
              Lowest Score First
            </option>

          </select>

        </div>

      </div>


      {/* PIPELINE */}
      <div className="pipeline">

        <div className="pipeline-box strong">
          Strong Hire
          <span>{strongCount}</span>
        </div>

        <div className="pipeline-box consider">
          Consider
          <span>{considerCount}</span>
        </div>

        <div className="pipeline-box reject">
          Reject
          <span>{rejectCount}</span>
        </div>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="empty-state">
          Loading candidates...
        </div>
      )}


      {/* EMPTY */}
      {!loading && candidates.length === 0 && (

        <div className="empty-state">
          No candidates yet.
        </div>

      )}


      {/* TABLE */}
      {!loading && candidates.length > 0 && (

        <table className="candidate-table">

          <thead>

            <tr>

              <th>Name</th>
              <th>ATS Score</th>
              <th>Role</th>
              <th>Matched</th>
              <th>Missing</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update</th>
              <th>Delete</th>

            </tr>

          </thead>

          <tbody>

            {sortedCandidates.map(candidate => (

              <tr key={candidate.id}>

                <td>{candidate.name}</td>

                <td className="score">
                  {candidate.score}%
                </td>

                <td>{candidate.role}</td>

                <td className="match">
                  {candidate.matched_skills?.length || 0}
                </td>

                <td className="missing">
                  {candidate.missing_skills?.length || 0}
                </td>

                <td>

                  <span className={`status ${candidate.status.toLowerCase().replace(" ", "-")}`}>
                    {candidate.status}
                  </span>

                </td>

                <td>
                  {new Date(candidate.created_at).toLocaleString()}
                </td>

                <td>

                  <select
                    value={candidate.status}
                    onChange={(e) =>
                      updateStatus(candidate.id, e.target.value)
                    }
                  >

                    <option>Strong Hire</option>
                    <option>Consider</option>
                    <option>Reject</option>

                  </select>

                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteCandidate(candidate.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

};

export default Dashboard;
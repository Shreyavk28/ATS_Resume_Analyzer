import React, { useState, useEffect } from "react";
import "./Dashboard.css";


// ✅ BEST PRACTICE: environment variable
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://ats-backend-re6q.onrender.com/api";


const Dashboard = () => {

  const [candidates, setCandidates] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);


  // =========================
  // FETCH CANDIDATES
  // =========================
  const fetchCandidates = async () => {

    try {

      setLoading(true);

      console.log(
        "Fetching from:",
        `${API_BASE}/candidates/`
      );

      const res = await fetch(
        `${API_BASE}/candidates/`
      );

      if (!res.ok)
        throw new Error(
          "Failed to fetch"
        );

      const data =
        await res.json();

      setCandidates(data);

    }
    catch (error) {

      console.error(
        "Fetch error:",
        error
      );

      alert(
        "Backend waking up. Please wait and refresh."
      );

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchCandidates();

  }, []);



  // =========================
  // DECISION LOGIC
  // =========================
  const getDecision = (

    score = 0

  ) => {

    if (score >= 75)
      return "Strong Hire";

    if (score >= 60)
      return "Consider";

    return "Reject";

  };



  // =========================
  // ADD CURRENT CANDIDATE
  // =========================
  const addCurrentCandidate = async () => {

    if (adding) return;

    const stored =
      localStorage.getItem(
        "ats_result"
      );

    if (!stored) {

      alert(
        "Please analyze resume first"
      );

      return;

    }

    const ats =
      JSON.parse(stored);


    const candidateName =
      ats.candidate_name ||
      `${ats.predicted_role || "Candidate"} Candidate`;


    try {

      setAdding(true);

      const res = await fetch(

        `${API_BASE}/candidates/add/`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            name:
              candidateName,

            score:
              ats.ats_score || 0,

            role:
              ats.predicted_role ||
              "Unknown",

            matched_skills:
              ats.matched_skills || [],

            missing_skills:
              ats.missing_skills || [],

            status:
              getDecision(
                ats.ats_score
              )

          })

        }

      );


      if (!res.ok)
        throw new Error(
          "Failed to add"
        );


      alert(
        "✅ Candidate added successfully"
      );

      fetchCandidates();

    }
    catch (error) {

      console.error(
        "Add error:",
        error
      );

      alert(
        "Backend sleeping. Try again in 30 seconds."
      );

    }
    finally {

      setAdding(false);

    }

  };



  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (

    id,

    newStatus

  ) => {

    try {

      const res = await fetch(

        `${API_BASE}/candidates/${id}/update/`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            status:
              newStatus

          })

        }

      );


      if (!res.ok)
        throw new Error(
          "Update failed"
        );


      fetchCandidates();

    }
    catch (error) {

      console.error(
        error
      );

      alert(
        "Failed to update status"
      );

    }

  };



  // =========================
  // DELETE CANDIDATE
  // =========================
  const deleteCandidate = async (

    id

  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this candidate?"
      );

    if (!confirmDelete)
      return;


    try {

      const res = await fetch(

        `${API_BASE}/candidates/${id}/delete/`,

        {

          method:
            "DELETE"

        }

      );


      if (!res.ok)
        throw new Error(
          "Delete failed"
        );


      alert(
        "Candidate deleted"
      );

      fetchCandidates();

    }
    catch (error) {

      console.error(
        error
      );

      alert(
        "Delete failed"
      );

    }

  };



  // =========================
  // SORT LOGIC
  // =========================
  const sortedCandidates =
    [...candidates].sort(

      (a, b) => {

        const scoreA =
          a.score || 0;

        const scoreB =
          b.score || 0;

        return sortOrder === "desc"

          ?

          scoreB - scoreA

          :

          scoreA - scoreB;

      }

    );



  // =========================
  // PIPELINE COUNTS
  // =========================
  const strongCount =
    candidates.filter(

      c =>
        c.status ===
        "Strong Hire"

    ).length;


  const considerCount =
    candidates.filter(

      c =>
        c.status ===
        "Consider"

    ).length;


  const rejectCount =
    candidates.filter(

      c =>
        c.status ===
        "Reject"

    ).length;



  // =========================
  // UI
  // =========================
  return (

    <div className="dashboard-container">


      <div className="dashboard-header">

        <h1>

          Recruiter Dashboard

        </h1>


        <div className="dashboard-actions">

          <button

            className="add-btn"

            onClick={
              addCurrentCandidate
            }

            disabled={adding}

          >

            {

              adding

                ?

                "Adding..."

                :

                "+ Add Current Candidate"

            }

          </button>


          <select

            className="sort-select"

            value={sortOrder}

            onChange={

              e =>

                setSortOrder(
                  e.target.value
                )

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

          <span>

            {strongCount}

          </span>

        </div>


        <div className="pipeline-box consider">

          Consider

          <span>

            {considerCount}

          </span>

        </div>


        <div className="pipeline-box reject">

          Reject

          <span>

            {rejectCount}

          </span>

        </div>

      </div>



      {/* LOADING */}

      {loading && (

        <div className="empty-state">

          Loading candidates...

        </div>

      )}



      {/* EMPTY */}

      {!loading &&
        candidates.length === 0 && (

          <div className="empty-state">

            No candidates yet.

          </div>

        )}



      {/* TABLE */}

      {!loading &&
        candidates.length > 0 && (

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

              {sortedCandidates.map(

                candidate => (

                  <tr key={candidate.id}>

                    <td>

                      {candidate.name}

                    </td>


                    <td className="score">

                      {candidate.score}%

                    </td>


                    <td>

                      {candidate.role}

                    </td>


                    <td className="match">

                      {

                        candidate.matched_skills
                          ?.length || 0

                      }

                    </td>


                    <td className="missing">

                      {

                        candidate.missing_skills
                          ?.length || 0

                      }

                    </td>


                    <td>

                      <span

                        className={`status ${candidate.status.toLowerCase().replace(" ", "-")}`}

                      >

                        {candidate.status}

                      </span>

                    </td>


                    <td>

                      {

                        new Date(
                          candidate.created_at
                        ).toLocaleString()

                      }

                    </td>


                    <td>

                      <select

                        value={candidate.status}

                        onChange={

                          e =>

                            updateStatus(

                              candidate.id,

                              e.target.value

                            )

                        }

                      >

                        <option>

                          Strong Hire

                        </option>

                        <option>

                          Consider

                        </option>

                        <option>

                          Reject

                        </option>

                      </select>

                    </td>


                    <td>

                      <button

                        className="delete-btn"

                        onClick={() =>

                          deleteCandidate(

                            candidate.id

                          )

                        }

                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                )

              )}

            </tbody>

          </table>

        )}

    </div>

  );

};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FillerDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  const handleNewForm = () => {
    navigate('/select-loan-officer');
  };

  const handleViewSubmission = (id) => {
    navigate(`/submissions/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Filler Dashboard</h1>
      <div className="dashboard-sections">
        {/* Fill New Form Section */}
        <div className="new-form-section">
          <h2>Fill New Form</h2>
          <button onClick={handleNewForm}>Start New Form</button>
        </div>

        {/* Submission History Section */}
        <div className="history-section">
          <h2>Submission History</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Form Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.name}</td>
                    <td>{new Date(submission.created_at).toLocaleString()}</td>
                    <td>{submission.status}</td>
                    <td>
                      <button onClick={() => handleViewSubmission(submission.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillerDashboard;

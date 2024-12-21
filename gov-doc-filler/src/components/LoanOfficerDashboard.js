import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const LoanOfficerDashboard = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/loan-officers/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        alert('Could not load submissions.');
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div>
      <h1>Loan Officer Dashboard</h1>
      {submissions.length > 0 ? (
        <div>
          {submissions.map((submission) => (
            <div key={submission.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
              <p><strong>Name:</strong> {submission.filler_name}</p>
              <p><strong>Email:</strong> {submission.filler_email}</p>
              {submission.pdf_path ? (
                <a
                  href={`http://localhost:5000${submission.pdf_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  View PDF
                </a>
              ) : (
                <p style={{ color: 'gray' }}>No PDF available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No fillers have selected you yet.</p>
      )}
    </div>
  );
};

export default LoanOfficerDashboard;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SubmissionDetails = () => {
  const { id } = useParams();
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissionData(response.data);
      } catch (error) {
        console.error('Error fetching submission details:', error);
      }
    };

    fetchSubmissionDetails();
  }, [id]);

  if (!submissionData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Submission Details</h1>
      <form>
        {/* Populate the form fields with submissionData */}
        {Object.entries(submissionData).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            <input type="text" value={value || ''} readOnly />
          </div>
        ))}
      </form>
    </div>
  );
};

export default SubmissionDetails;

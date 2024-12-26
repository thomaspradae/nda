import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SubmissionDetails = () => {
  const { id } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissionData(response.data);
        setUpdatedData(response.data); // Initialize updatedData with original data
      } catch (error) {
        console.error('Error fetching submission details:', error);
      }
    };

    fetchSubmissionDetails();
  }, [id]);

  const handleEditClick = (key) => {
    setEditField(key);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/submissions/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Submission updated and PDF regenerated successfully!');
      setEditField(null);
    } catch (error) {
      console.error('Error saving submission details:', error);
    }
  };

  if (!submissionData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Submission Details</h1>
      <form>
        {Object.entries(updatedData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label>{key}</label>
            {editField === key ? (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => setUpdatedData({ ...updatedData, [key]: e.target.value })}
              />
            ) : (
              <>
                <span style={{ marginLeft: '1rem' }}>{value || 'N/A'}</span>
                <button
                  type="button"
                  style={{ marginLeft: '1rem' }}
                  onClick={() => handleEditClick(key)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SubmissionDetails;

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticateToken = require('../middleware/authenticateToken'); // Adjust the path as necessary

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gov_doc_filler_base',
  password: 'Warrenzack1', // Use environment variables in production
  port: 5432,
});

// Get Submissions for Loan Officer
router.get('/submissions', authenticateToken, async (req, res) => {
  if (req.user.role !== 'loan_officer') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const loanOfficerId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT s.*, f.name AS filler_name, f.email AS filler_email
       FROM submissions s
       JOIN fillers f ON s.filler_id = f.id
       WHERE s.loan_officer_id = $1`,
      [loanOfficerId]
    );
    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

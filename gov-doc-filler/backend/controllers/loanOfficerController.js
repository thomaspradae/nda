const pool = require('../../config/db');
const { hashPassword, comparePasswords } = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Use environment variable

// Register Loan Officer
const registerLoanOfficer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await hashPassword(password);
    const identifier = generateIdentifier(); // Implement this function

    const query = `
      INSERT INTO loan_officers (name, email, password_hash, identifier)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, identifier
    `;
    const values = [name, email, passwordHash, identifier];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Loan officer registered successfully', loanOfficer: result.rows[0] });
  } catch (error) {
    console.error('Error registering loan officer:', error);
    res.status(500).json({ message: 'Error registering loan officer' });
  }
};

// Login Loan Officer
const loginLoanOfficer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM loan_officers WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const loanOfficer = result.rows[0];
    const validPassword = await comparePasswords(password, loanOfficer.password_hash);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: loanOfficer.id, role: 'loan_officer' }, secret, { expiresIn: '1h' });

    res.json({ token, loanOfficer: { id: loanOfficer.id, name: loanOfficer.name, email: loanOfficer.email } });
  } catch (error) {
    console.error('Error logging in loan officer:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get Submissions
const getSubmissions = async (req, res) => {
  const loanOfficerId = req.user.id;

  try {
    const query = `
      SELECT s.*, f.name as filler_name, f.email as filler_email
      FROM submissions s
      JOIN fillers f ON s.filler_id = f.id
      WHERE s.loan_officer_id = $1
    `;
    const result = await pool.query(query, [loanOfficerId]);

    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Helper function to generate identifier
const generateIdentifier = () => {
  return 'LO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

module.exports = { registerLoanOfficer, loginLoanOfficer, getSubmissions };

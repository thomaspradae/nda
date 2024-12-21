// controllers/fillerController.js

const pool = require('../../config/db');
const { hashPassword, comparePasswords } = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Use environment variable in production

// Register Filler
const registerFiller = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const userCheck = await pool.query('SELECT id FROM fillers WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    const query = `
      INSERT INTO fillers (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    const values = [name, email, passwordHash];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Filler registered successfully',
      filler: result.rows[0],
    });
  } catch (error) {
    console.error('Error registering filler:', error);
    res.status(500).json({ message: 'Error registering filler' });
  }
};

// Login Filler
const loginFiller = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM fillers WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const filler = result.rows[0];

    // Compare passwords
    const validPassword = await comparePasswords(password, filler.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: filler.id, role: 'filler' }, secret, { expiresIn: '1h' });

    res.json({
      token,
      filler: {
        id: filler.id,
        name: filler.name,
        email: filler.email,
      },
    });
  } catch (error) {
    console.error('Error logging in filler:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get Loan Officers
const getLoanOfficers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM loan_officers');
    res.json({ loanOfficers: result.rows });
  } catch (error) {
    console.error('Error fetching loan officers:', error);
    res.status(500).json({ message: 'Error fetching loan officers' });
  }
};

// Select Loan Officer
const selectLoanOfficer = async (req, res) => {
  const fillerId = req.user.id;
  const { loanOfficerId } = req.body;

  try {
    const query = `UPDATE fillers SET loan_officer_id = $1 WHERE id = $2`;
    await pool.query(query, [loanOfficerId, fillerId]);

    res.json({ message: 'Loan officer selected successfully' });
  } catch (error) {
    console.error('Error selecting loan officer:', error);
    res.status(500).json({ message: 'Error selecting loan officer' });
  }
};

module.exports = {
  registerFiller,
  loginFiller,
  getLoanOfficers,
  selectLoanOfficer,
};

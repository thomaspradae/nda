// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { exec } = require('child_process');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // Google Auth Library

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gov_doc_filler_base',
  password: 'Warrenzack1', // Use environment variables in production
  port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = 'your_jwt_secret_key';

const googleClient = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID'); // Replace with your actual Google Client ID

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN'
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists in the database
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      // Register the user if not found
      user = await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [name, email, 'filler'] // Default role is "filler"; update as necessary
      );
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken, user: user.rows[0] });
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Loan Officer Registration
app.post('/api/loan-officers/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existingOfficer = await pool.query('SELECT * FROM loan_officers WHERE email = $1', [email]);
    if (existingOfficer.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // Generate a unique identifier
    const identifier = 'LO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    // Insert the loan officer into the database
    const result = await pool.query(
      'INSERT INTO loan_officers (name, email, password_hash, identifier) VALUES ($1, $2, $3, $4) RETURNING id, name, email, identifier',
      [name, email, passwordHash, identifier]
    );
    res.status(201).json({ loanOfficer: result.rows[0] });
  } catch (error) {
    console.error('Error registering loan officer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Loan Officer Login
app.post('/api/loan-officers/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const officerResult = await pool.query('SELECT * FROM loan_officers WHERE email = $1', [email]);
    if (officerResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const officer = officerResult.rows[0];
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, officer.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: officer.id, role: 'loan_officer' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, loanOfficer: { id: officer.id, name: officer.name, email: officer.email } });
  } catch (error) {
    console.error('Error logging in loan officer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['filler', 'loan_officer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  const table = role === 'filler' ? 'fillers' : 'loan_officers';

  try {
    // Check if email already exists
    const existingUser = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const query = `
      INSERT INTO ${table} (name, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email
    `;
    const values = [name, email, passwordHash];
    const result = await pool.query(query, values);

    // Generate JWT token
    const token = jwt.sign({ id: result.rows[0].id, role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { ...result.rows[0], role } });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Search both tables
    let user = await pool.query('SELECT * FROM fillers WHERE email = $1', [email]);
    let role = 'filler';

    if (user.rows.length === 0) {
      user = await pool.query('SELECT * FROM loan_officers WHERE email = $1', [email]);
      role = 'loan_officer';
    }

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: userData.id, role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { ...userData, role } });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Filler Registration
app.post('/api/fillers/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existingFiller = await pool.query('SELECT * FROM fillers WHERE email = $1', [email]);
    if (existingFiller.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // Insert the filler into the database
    const result = await pool.query(
      'INSERT INTO fillers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );
    res.status(201).json({ filler: result.rows[0] });
  } catch (error) {
    console.error('Error registering filler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Filler Login
app.post('/api/fillers/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const fillerResult = await pool.query('SELECT * FROM fillers WHERE email = $1', [email]);
    if (fillerResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const filler = fillerResult.rows[0];
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, filler.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: filler.id, role: 'filler' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, filler: { id: filler.id, name: filler.name, email: filler.email } });
  } catch (error) {
    console.error('Error logging in filler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Loan Officers (for fillers to select)
app.get('/api/fillers/loan-officers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM loan_officers');
    res.json({ loanOfficers: result.rows });
  } catch (error) {
    console.error('Error fetching loan officers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get submission history for a filler
app.get('/api/submissions', authenticateToken, async (req, res) => {
  const fillerId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT id, name, created_at, status
       FROM submissions
       WHERE filler_id = $1
       ORDER BY created_at DESC`,
      [fillerId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching submission history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get details of a specific submission
app.get('/api/submissions/:id', authenticateToken, async (req, res) => {
  const submissionId = req.params.id;
  const fillerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM submissions WHERE id = $1 AND filler_id = $2`,
      [submissionId, fillerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Submissions for Loan Officer
app.get('/api/loan-officers/submissions', authenticateToken, async (req, res) => {
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


// Filler selects Loan Officer
app.post('/api/fillers/select-loan-officer', authenticateToken, async (req, res) => {
  const fillerId = req.user.id;
  const { loanOfficerId } = req.body;
  try {
    await pool.query('UPDATE fillers SET loan_officer_id = $1 WHERE id = $2', [loanOfficerId, fillerId]);
    res.json({ message: 'Loan officer selected successfully' });
  } catch (error) {
    console.error('Error selecting loan officer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle Form Data and insert it into PostgreSQL
app.post('/submit', authenticateToken, async (req, res) => {
  const {
    name,
    alternateNames,
    dobMonth,
    dobDay,
    dobYear,
    ssnPart1,
    ssnPart2,
    ssnPart3,
    citizenship,
    email,
    maritalStatus,
    employmentStatus,
    occupation,
    annualIncome,
    incomeSource,
  } = req.body;

  try {
    // Get the filler ID from the authenticated user
    const fillerId = req.user.id;
    // Get the loan officer ID associated with the filler
    const fillerResult = await pool.query('SELECT loan_officer_id FROM fillers WHERE id = $1', [fillerId]);
    const loanOfficerId = fillerResult.rows[0].loan_officer_id;

    // Now include `filler_id` and `loan_officer_id` in your INSERT query
    const query = `
      INSERT INTO submissions (
        name, alternate_names, dob_month, dob_day, dob_year, ssn_part1, ssn_part2, ssn_part3,
        citizenship, email, marital_status, employment_status, occupation, annual_income, income_source,
        filler_id, loan_officer_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `;
    const values = [
      name,
      alternateNames,
      dobMonth,
      dobDay,
      dobYear,
      ssnPart1,
      ssnPart2,
      ssnPart3,
      citizenship,
      email,
      maritalStatus,
      employmentStatus,
      occupation,
      annualIncome,
      incomeSource,
      fillerId,
      loanOfficerId,
    ];

    const result = await pool.query(query, values); // Insert form data into PostgreSQL
    const submissionId = result.rows[0].id; // Get the inserted submission ID

    console.log(`New submission ID: ${submissionId}`);

    // Define the paths using the path module
    const pythonExecutable = 'python'; // Assumes 'python' is in the system PATH

    // Construct the script path relative to this file (server.js)
    const scriptPath = path.join(__dirname, '..', 'pdf_script', 'read_pdf.py');

    // Construct the command
    const command = `"${pythonExecutable}" "${scriptPath}" ${submissionId}`;

    // Execute the Python script
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).send('Error generating PDF');
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }
    
      // stdout should contain the PDF file path
      const pdfPath = stdout.trim(); // Trim any newline characters
      console.log(`Generated PDF Path: ${pdfPath}`);
    
      // Update the submission with the PDF path
      try {
        await pool.query('UPDATE submissions SET pdf_path = $1 WHERE id = $2', [pdfPath, submissionId]);
        res.send('Form data saved and PDF path updated in the database!');
      } catch (dbError) {
        console.error('Error saving PDF path:', dbError);
        res.status(500).send('Error saving PDF path');
      }
    });    
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).send('Error saving form data');
  }
});

app.use('/pdfs', express.static(path.join(__dirname, 'pdf_script', 'output_pdfs')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

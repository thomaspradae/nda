const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { exec } = require('child_process');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gov_doc_filler_base',
  password: 'Warrenzack1', // In production, use environment variables
  port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Handle Form Data and insert it into PostgreSQL
app.post('/submit', async (req, res) => {
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
    const query = `
      INSERT INTO submissions (
        name, alternate_names, dob_month, dob_day, dob_year, ssn_part1, ssn_part2, ssn_part3,
        citizenship, email, marital_status, employment_status, occupation, annual_income, income_source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
    ];

    const result = await pool.query(query, values); // Insert form data into PostgreSQL
    const submissionId = result.rows[0].id; // Get the inserted submission ID

    console.log(`New submission ID: ${submissionId}`);

    // Define the paths using the path module
    const pythonExecutable = 'python'; // Assumes 'python' is in the system PATH
    // If 'python' is not in the PATH, specify the full path to the Python executable
    // For example: const pythonExecutable = '/usr/bin/python3';

    // Construct the script path relative to this file (server.js)
    const scriptPath = path.join(__dirname, '..', 'pdf_script', 'read_pdf.py');

    // Construct the command
    const command = `"${pythonExecutable}" "${scriptPath}" ${submissionId}`;

    // Execute the Python script
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).send('Error generating PDF');
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }
      console.log(`Python script output: ${stdout}`);
      res.send('Form data saved to the database and PDF generated!');
    });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).send('Error saving form data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gov_doc_filler_base',
  password: 'Warrenzack1', // The password you just entered
  port: 5432, // Default PostgreSQL port
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
    `;
    const values = [
      name, alternateNames, dobMonth, dobDay, dobYear, ssnPart1, ssnPart2, ssnPart3,
      citizenship, email, maritalStatus, employmentStatus, occupation, annualIncome, incomeSource,
    ];

    await pool.query(query, values); // Insert form data into PostgreSQL
    
    res.send('Form data saved to the database!');
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).send('Error saving form data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

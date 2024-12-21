CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  alternate_names VARCHAR(255),
  dob_month VARCHAR(2),
  dob_day VARCHAR(2),
  dob_year VARCHAR(4),
  ssn_part1 VARCHAR(3),
  ssn_part2 VARCHAR(2),
  ssn_part3 VARCHAR(4),
  citizenship VARCHAR(50),
  email VARCHAR(255),
  marital_status VARCHAR(50),
  employment_status VARCHAR(50),
  occupation VARCHAR(100),
  annual_income NUMERIC(10, 2),
  income_source VARCHAR(100)
);

CREATE TABLE loan_officers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  identifier VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE fillers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  loan_officer_id INTEGER REFERENCES loan_officers(id)
);

ALTER TABLE submissions
ADD COLUMN filler_id INTEGER REFERENCES fillers(id),
ADD COLUMN loan_officer_id INTEGER REFERENCES loan_officers(id);


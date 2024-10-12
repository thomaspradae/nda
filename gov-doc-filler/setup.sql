CREATE DATABASE gov_doc_filler_base;

\c gov_doc_filler_base;

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    marital_status VARCHAR(50),
    age INT
);
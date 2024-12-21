const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gov_doc_filler_base',
  password: 'Warrenzack1',
  port: 5432,
});

module.exports = pool;

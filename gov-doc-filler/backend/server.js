const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Handle Form Data
app.post('/submit', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Form data received!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

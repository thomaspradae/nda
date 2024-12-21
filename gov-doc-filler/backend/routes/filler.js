// routes/filler.js

const express = require('express');
const router = express.Router();
const {
  registerFiller,
  loginFiller,
  getLoanOfficers,
  selectLoanOfficer,
} = require('../controllers/fillerController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Registration
router.post('/register', registerFiller);

// Login
router.post('/login', loginFiller);

// Get Loan Officers (Protected)
router.get('/loan-officers', authenticateToken, getLoanOfficers);

// Select Loan Officer (Protected)
router.post('/select-loan-officer', authenticateToken, selectLoanOfficer);

module.exports = router;

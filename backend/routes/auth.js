// backend/routes/auth.js
const express = require('express');
const router  = express.Router();

const {
  login,
  register,
  registerDoctor,
  verify
} = require('../controllers/AuthController');

const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

router.post('/register-doctor', registerDoctor);

// GET /api/auth/verify  (protegida)
router.get('/verify', authMiddleware, verify);

module.exports = router;

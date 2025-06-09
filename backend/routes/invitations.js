// backend/routes/invitations.js

const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');
const { createInvitation } = require('../controllers/InvitationController');

router.post('/', authenticate, createInvitation);

module.exports = router;

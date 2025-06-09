// backend/routes/doctorQuestions.js

const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listForUser, ask, answer, listByUserId } = require('../controllers/DoctorQuestionController');
// …
router.use(authMiddleware);
router.get('/', listForUser);
router.post('/', ask);
router.put('/:id/answer', answer);
router.get('/user/:userId', listByUserId);
module.exports = router;
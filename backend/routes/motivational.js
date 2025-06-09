// backend/routes/motivational.js
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAll, create, delete: remove } = require('../controllers/MotivationalController');

router.use(authMiddleware);
router.get('/', getAll);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;

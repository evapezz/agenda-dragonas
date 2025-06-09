// backend/routes/dragonaProfile.js
const router = require('express').Router();
const authMiddleware  = require('../middleware/authMiddleware');
const { get, upsert } = require('../controllers/DragonaProfileController');

router.use(authMiddleware);
router.get('/', get);
router.post('/', upsert);  // crea o actualiza

module.exports = router;

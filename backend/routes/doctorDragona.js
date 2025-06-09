// backend/routes/doctorDragona.js
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listByDoctor, link, unlink } = require('../controllers/DoctorDragonaController');

router.use(authMiddleware);
router.get('/my-patiens', listByDoctor);
router.post('/', link);
router.delete('/:dragonaId', unlink);

module.exports = router;

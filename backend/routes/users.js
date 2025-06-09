// proyecto/backend/routes/users.js
const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');
const UserController = require('../controllers/UserController');

// Todas las rutas de usuario requieren autenticación
router.use(authenticate);

// GET   /api/users           ⇒ Listar todos los usuarios (listAll)
router.get('/', UserController.listAll);

// GET   /api/users/:id       ⇒ Obtener un usuario por ID (getById)
router.get('/:id', UserController.getById);

// PUT   /api/users/:id       ⇒ Actualizar un usuario (update)
router.put('/:id', UserController.update);

// GET   /api/users/role/dragonas ⇒ Listar todas las dragonas
router.get('/role/dragonas', UserController.listDragonas);

// GET   /api/users/role/doctors  ⇒ Listar todos los médicos
router.get('/role/doctors', UserController.listDoctors);

module.exports = router;

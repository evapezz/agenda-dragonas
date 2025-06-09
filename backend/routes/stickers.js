// backend/routes/stickers.js

const express = require('express');
const router = express.Router();
const  authMiddleware= require('../middleware/authMiddleware');
const {
  getAll,
  getByCategory
} = require('../controllers/StickerController');
const {
  getPlacedByUser,
  place,
  updatePlacement,
  deletePlacement
} = require('../controllers/PlacedStickerController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET    /api/stickers                   → Obtener todas las pegatinas
router.get('/', getAll);

// GET    /api/stickers/category/:category → Obtener pegatinas por categoría
router.get('/category/:category', getByCategory);

// GET    /api/stickers/placed/user/:userId → Obtener pegatinas colocadas por usuario
router.get('/placed/user/:userId', getPlacedByUser);

// POST   /api/stickers/placed            → Colocar una nueva pegatina
router.post('/placed', place);

// PUT    /api/stickers/placed/:id        → Actualizar posición de pegatina colocada
router.put('/placed/:id', updatePlacement);

// DELETE /api/stickers/placed/:id        → Eliminar pegatina colocada
router.delete('/placed/:id', deletePlacement);

module.exports = router;

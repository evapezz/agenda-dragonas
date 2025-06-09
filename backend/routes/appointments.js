// proyecto/backend/routes/appointments.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/AppointmentController');

// Cualquier ruta de citas requiere token válido
router.use(authMiddleware);

// GET    /api/appointments        → Listar todas las citas del usuario
router.get('/', getAppointments);

// GET    /api/appointments/:id    → Obtener una cita por ID
router.get('/:id', getAppointmentById);

// POST   /api/appointments        → Crear nueva cita
router.post('/', createAppointment);

// PUT    /api/appointments/:id    → Actualizar cita existente
router.put('/:id', updateAppointment);

// DELETE /api/appointments/:id    → Eliminar cita
router.delete('/:id', deleteAppointment);

module.exports = router;

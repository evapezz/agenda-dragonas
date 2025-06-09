// proyecto/backend/controllers/AppointmentController.js

const { Appointment } = require('../models');

exports.getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Obtener todas las citas del usuario auténticado
    const appointments = await Appointment.findAll({
      where: { userId },
      order: [['date', 'ASC']],
    });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const appointment = await Appointment.findOne({
      where: { id, userId },
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada o sin permisos.' });
    }
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      date,
      location,
      appointmentType = 'medica',
      reminder = false,
      reminderTime = null,
    } = req.body;

    // Validar campos mínimos
    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Título, fecha y ubicación son obligatorios.' });
    }
    const newAppt = await Appointment.create({
      userId,
      title,
      description: description || '',
      date,
      location,
      appointmentType,
      reminder,
      reminderTime,
    });
    res.status(201).json(newAppt);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const {
      title,
      description,
      date,
      location,
      appointmentType,
      reminder,
      reminderTime,
    } = req.body;

    // Buscar la cita y asegurarse de que pertenece al usuario
    const appt = await Appointment.findOne({ where: { id, userId } });
    if (!appt) {
      return res.status(404).json({ message: 'Cita no encontrada o sin permisos.' });
    }

    // Actualizar solo los campos que vengan en el body
    await appt.update({
      title: title ?? appt.title,
      description: description ?? appt.description,
      date: date ?? appt.date,
      location: location ?? appt.location,
      appointmentType: appointmentType ?? appt.appointmentType,
      reminder: reminder ?? appt.reminder,
      reminderTime: reminderTime ?? appt.reminderTime,
    });

    res.json(appt);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deleted = await Appointment.destroy({
      where: { id, userId },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Cita no encontrada o sin permisos.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

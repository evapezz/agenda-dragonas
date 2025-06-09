// proyecto/backend/controllers/SymptomController.js

const { Symptom, User } = require('../models');

// LISTAR historial completo de síntomas para una usuaria (dragona) dada
// GET  /api/symptoms/user/:userId
exports.listByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Solo el propio usuario (dragona) puede ver su historial: validamos que el token pertenezca a ese userId
    if (parseInt(userId, 10) !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver este historial.' });
    }

    const symptoms = await Symptom.findAll({
      where: { userId: userId },
      order: [['symptomDate', 'DESC']],
    });
    return res.json(symptoms);
  } catch (error) {
    console.error('Error al listar síntomas:', error);
    return res.status(500).json({ message: 'Error del servidor al obtener historial.' });
  }
};

// CREAR un nuevo registro de síntomas para la dragona autenticada
// POST /api/symptoms
exports.createSymptom = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      date,       // corresponde a 'symptom_date'
      pain,       // corresponde a 'pain_level'
      fatigue,    // corresponde a 'fatigue_level'
      nausea,     // corresponde a 'nausea_level'
      notes,      // campo opcional
    } = req.body;

    // Validación mínima: la fecha es obligatoria
    if (!date) {
      return res.status(400).json({ message: 'La fecha es obligatoria.' });
    }
    // Validamos que los niveles, si vienen, sean números entre 0 y 10
    const toInt = (v) => (v == null ? null : parseInt(v, 10));
    const p = toInt(pain);
    const f = toInt(fatigue);
    const n = toInt(nausea);
    if (
      (p != null && (isNaN(p) || p < 0 || p > 10)) ||
      (f != null && (isNaN(f) || f < 0 || f > 10)) ||
      (n != null && (isNaN(n) || n < 0 || n > 10))
    ) {
      return res
        .status(400)
        .json({ message: 'Los niveles de dolor, fatiga o náuseas deben ser de 0 a 10.' });
    }

    // Creamos el registro en la base de datos
    const newSymptom = await Symptom.create({
      userId: userId,
      symptomDate: date,
      painLevel: p,
      fatigueLevel: f,
      nauseaLevel: n,
      anxietyLevel: null,   
      sleepQuality: null,    
      appetiteLevel: null,   
      notes: notes || null,
      sharedWithDoctor: false,
    });

    return res.status(201).json(newSymptom);
  } catch (error) {
    console.error('Error al crear síntoma:', error);
    return res.status(500).json({ message: 'Error del servidor al crear el síntoma.' });
  }
};


// (Estos métodos pueden usarse en un futuro, pero por ahora no se usan desde el frontend)
exports.updateSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const symptom = await Symptom.findOne({ where: { id, userId } });
    if (!symptom) {
      return res.status(404).json({ message: 'Registro no encontrado o sin permisos.' });
    }

    const { date, pain, fatigue, nausea, notes } = req.body;
    if (date) symptom.symptomDate = date;
    if (pain != null) symptom.painLevel = parseInt(pain, 10);
    if (fatigue != null) symptom.fatigueLevel = parseInt(fatigue, 10);
    if (nausea != null) symptom.nauseaLevel = parseInt(nausea, 10);
    if (notes !== undefined) symptom.notes = notes || null;

    await symptom.save();
    return res.json(symptom);
  } catch (error) {
    console.error('Error al actualizar síntoma:', error);
    return res.status(500).json({ message: 'Error del servidor al actualizar.' });
  }
};

exports.deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await Symptom.destroy({ where: { id, userId } });
    if (!deleted) {
      return res.status(404).json({ message: 'Registro no encontrado o sin permisos.' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar síntoma:', error);
    return res.status(500).json({ message: 'Error del servidor al eliminar.' });
  }
};

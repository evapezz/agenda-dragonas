// backend/controllers/DoctorQuestionController.js
const { DoctorQuestion, DoctorDragona } = require('../models');

// La dragona ve solo sus propias preguntas
exports.listForUser = async (req, res, next) => {
  try {
    const qs = await DoctorQuestion.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(qs);
  } catch (err) {
    next(err);
  }
};

// La dragona hace una pregunta
exports.ask = async (req, res, next) => {
  try {
    const { question } = req.body;
    const q = await DoctorQuestion.create({
      userId: req.user.id,
      question,
      isAnswered: false
    });
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
};

// El médico responde una pregunta existente
exports.answer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    // Verificamos que exista la pregunta antes de actualizar
    const pregunta = await DoctorQuestion.findByPk(id);
    if (!pregunta) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    const [updated] = await DoctorQuestion.update(
      { answer, isAnswered: true },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'No se pudo actualizar la pregunta' });
    }
    const q = await DoctorQuestion.findByPk(id);
    res.json(q);
  } catch (err) {
    next(err);
  }
};

// El médico lista todas las preguntas de una dragona (solo si está vinculado)
exports.listByUserId = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { userId } = req.params;

    // 1) Comprobar vínculo doctor–dragona
    const vínculo = await DoctorDragona.findOne({
      where: { doctorId, dragonaId: userId }
    });
    if (!vínculo) {
      return res.status(403).json({ message: 'No estás autorizado para ver estas preguntas.' });
    }

    // 2) Listar preguntas de la dragona
    const qs = await DoctorQuestion.findAll({
      where: { userId },
      order: [['created_at', 'DESC']]
    });
    res.json(qs);
  } catch (err) {
    next(err);
  }
};

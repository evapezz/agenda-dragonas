const { DoctorDragona } = require('../models');

exports.listByDoctor = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const relations = await DoctorDragona.findAll({
      where: { doctorId }
    });
    res.json(relations);
  } catch (err) {
    next(err);
  }
};

exports.link = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { dragonaId } = req.body;
    const rel = await DoctorDragona.create({
      doctorId,
      dragonaId
    });
    res.status(201).json(rel);
  } catch (err) {
    next(err);
  }
};

exports.unlink = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { dragonaId } = req.params;
    await DoctorDragona.destroy({
      where: { doctorId, dragonaId }
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

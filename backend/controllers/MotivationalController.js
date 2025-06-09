// backend/controllers/MotivationalController.js
const { MotivationalContent } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const items = await MotivationalContent.findAll({
      where: { userId: req.user.id },
      order: [['contentDate','DESC']]
    });
    res.json(items);
  } catch (err) { next(err) }
};

exports.create = async (req, res, next) => {
  try {
    const { contentDate, gratitudeNotes, achievements, mood, quote, imagePath } = req.body;
    const item = await MotivationalContent.create({
      userId: req.user.id,
      contentDate, gratitudeNotes, achievements, mood, quote, imagePath
    });
    res.status(201).json(item);
  } catch (err) { next(err) }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await MotivationalContent.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) { next(err) }
};

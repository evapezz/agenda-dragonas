const { PlacedSticker, Sticker } = require('../models');

// GET /api/stickers/placed/user/:userId
exports.getPlacedByUser = async (req, res, next) => {
  try {
    const placements = await PlacedSticker.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Sticker, as: 'sticker', attributes: ['name','category','imagePath'] }]
    });
    res.json(placements);
  } catch (err) {
    next(err);
  }
};

// POST /api/stickers/placed
exports.place = async (req, res, next) => {
  try {
    const { userId, stickerId, positionX, positionY, scale = 1.0, rotation = 0 } = req.body;
    if (userId == null || stickerId == null || positionX == null || positionY == null) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const placement = await PlacedSticker.create({ userId, stickerId, positionX, positionY, scale, rotation });
    res.status(201).json(placement);
  } catch (err) {
    next(err);
  }
};

// PUT /api/stickers/placed/:id
exports.updatePlacement = async (req, res, next) => {
  try {
    const { positionX, positionY, scale = 1.0, rotation = 0 } = req.body;
    if (positionX == null || positionY == null) {
      return res.status(400).json({ message: 'Posición es requerida' });
    }
    const [updated] = await PlacedSticker.update(
      { positionX, positionY, scale, rotation },
      { where: { id: req.params.id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Pegatina colocada no encontrada' });
    }
    const placement = await PlacedSticker.findByPk(req.params.id);
    res.json(placement);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/stickers/placed/:id
exports.deletePlacement = async (req, res, next) => {
  try {
    const deleted = await PlacedSticker.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Pegatina colocada no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

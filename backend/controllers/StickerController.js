// backend/controllers/StickerController.js

const { Sticker } = require('../models');

// GET /api/stickers
exports.getAll = async (req, res, next) => {
  try {
    const stickers = await Sticker.findAll({ order: [['name','ASC']] });
    res.json(stickers);
  } catch (err) {
    next(err);
  }
};

// GET /api/stickers/category/:category
exports.getByCategory = async (req, res, next) => {
  try {
    const stickers = await Sticker.findAll({
      where: { category: req.params.category },
      order: [['name','ASC']]
    });
    res.json(stickers);
  } catch (err) {
    next(err);
  }
};

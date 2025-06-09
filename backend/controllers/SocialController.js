// backend/controllers/SocialController.js

const { SocialLink } = require('../models');

// GET /api/social/user/:userId
exports.getAllForUser = async (req, res, next) => {
  try {
    const links = await SocialLink.findAll({
      where: { userId: req.params.userId },
      order: [['platform', 'ASC']]
    });
    res.json(links);
  } catch (err) {
    next(err);
  }
};

// GET /api/social/user/:userId/public
exports.getPublicForUser = async (req, res, next) => {
  try {
    const links = await SocialLink.findAll({
      where: { userId: req.params.userId, isPublic: true },
      order: [['platform', 'ASC']]
    });
    res.json(links);
  } catch (err) {
    next(err);
  }
};

// POST /api/social
// Crea o actualiza un enlace social
exports.upsertLink = async (req, res, next) => {
  try {
    const { userId, platform, url, username, isPublic = false } = req.body;
    if (!userId || !platform || !url) {
      return res.status(400).json({ message: 'userId, platform y url son requeridos' });
    }

    const [link, created] = await SocialLink.upsert(
      { userId, platform, url, username, isPublic },
      { returning: true }
    );

    res.status(created ? 201 : 200).json({
      message: created
        ? 'Enlace social creado exitosamente'
        : 'Enlace social actualizado exitosamente',
      link
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/social/:id
exports.deleteLink = async (req, res, next) => {
  try {
    const deleted = await SocialLink.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Enlace social no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

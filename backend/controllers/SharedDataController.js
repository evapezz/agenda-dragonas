// backend/controllers/SharedDataController.js

const { SharedData, User } = require('../models');

// GET /api/shared/user/:dragonaId/doctor/:doctorId
exports.getConfig = async (req, res, next) => {
  try {
    const { dragonaId, doctorId } = req.params;
    const config = await SharedData.findOne({
      where: { dragonaId, doctorId }
    });
    res.json(config || {});
  } catch (err) {
    next(err);
  }
};

// PUT /api/shared/user/:dragonaId/doctor/:doctorId
exports.updateConfig = async (req, res, next) => {
  try {
    const { dragonaId, doctorId } = req.params;
    const { dataType, isShared } = req.body;
    if (!dataType) {
      return res.status(400).json({ message: 'dataType es requerido' });
    }

    const [config, created] = await SharedData.upsert({
      dragonaId,
      doctorId,
      dataType,
      isShared
    }, { returning: true });

    res.status(created ? 201 : 200).json({
      message: created
        ? 'Configuración creada exitosamente'
        : 'Configuración actualizada exitosamente',
      config
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/shared/doctor/:doctorId/dragonas
exports.getDragonas = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const dragonas = await User.findAll({
      include: [{
        model: SharedData,
        as: 'doctorSharedConfigs',
        where: { doctorId, isShared: true }
      }],
      attributes: ['id','username','name','email']
    });
    res.json(dragonas);
  } catch (err) {
    next(err);
  }
};

// backend/controllers/DragonaProfileController.js
const { DragonaProfile } = require('../models');

exports.get = async (req, res, next) => {
  try {
    const prof = await DragonaProfile.findOne({
      where: { userId: req.user.id }
    });
    res.json(prof);
  } catch (err) { next(err) }
};

exports.upsert = async (req, res, next) => {
  try {
    const data = { userId: req.user.id, ...req.body };
    const [profile, created] = await DragonaProfile.upsert(data, {
      where: { userId: req.user.id },
      returning: true
    });
    res.status(created ? 201 : 200).json(profile);
  } catch (err) { next(err) }
};

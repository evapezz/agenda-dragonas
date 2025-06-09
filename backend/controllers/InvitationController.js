// backend/controllers/InvitationController.js

const { Invitation } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Duración en días para que expire la invitación
const INVITATION_EXPIRE_DAYS = 7;

exports.createInvitation = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    if (req.user.role !== 'medico') {
      return res.status(403).json({ message: 'Solo los médicos pueden invitar a pacientes.' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'El campo email es requerido.' });
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRE_DAYS);

    const invitation = await Invitation.create({
      doctorId,
      email,
      token,
      expiresAt
    });

    res.status(201).json({
      message: 'Invitación creada con éxito.',
      invitation: {
        email: invitation.email,
        token: invitation.token,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (err) {
    next(err);
  }
};

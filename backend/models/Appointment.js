const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  appointment_type: {
    type: DataTypes.ENUM('medica', 'personal', 'tratamiento', 'otro'),
    allowNull: false,
    defaultValue: 'medica'
  },
  doctor_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('programada', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'programada'
  },
  reminder: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reminder_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Minutos antes de la cita para recordatorio'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true
});

module.exports = Appointment;


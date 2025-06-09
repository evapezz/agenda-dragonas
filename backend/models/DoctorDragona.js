const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DoctorDragona = sequelize.define('DoctorDragona', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dragona_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'doctor_dragona',
  timestamps: true,
  underscored: true
});

module.exports = DoctorDragona;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sticker = sequelize.define('Sticker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  emoji: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('emotions', 'achievements', 'health', 'motivation', 'celebration', 'support'),
    allowNull: false,
    defaultValue: 'emotions'
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  usage_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'stickers',
  timestamps: true,
  underscored: true
});

module.exports = Sticker;


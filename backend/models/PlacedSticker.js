const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PlacedSticker = sequelize.define('PlacedSticker', {
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
  sticker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stickers',
      key: 'id'
    }
  },
  motivational_content_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'motivational_content',
      key: 'id'
    }
  },
  position_x: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  position_y: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  size: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1.0
  },
  rotation: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'placed_stickers',
  timestamps: true,
  underscored: true
});

module.exports = PlacedSticker;


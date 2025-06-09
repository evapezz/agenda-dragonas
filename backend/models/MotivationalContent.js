const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MotivationalContent = sequelize.define('MotivationalContent', {
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
  content_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  gratitude_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  achievements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  energy_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10
    }
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reflection_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  challenge_faced: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tomorrow_goal: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'motivational_content',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['content_date'] },
    { fields: ['user_id', 'content_date'], unique: true }
  ]
});

module.exports = MotivationalContent;


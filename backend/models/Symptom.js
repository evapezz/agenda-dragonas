const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Symptom = sequelize.define('Symptom', {
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
  symptom_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      notFuture(value) {
        if (new Date(value) > new Date()) {
          throw new Error('La fecha no puede ser futura');
        }
      }
    }
  },
  pain_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  fatigue_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  nausea_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  anxiety_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  sleep_quality: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  appetite_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shared_with_doctor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'symptoms',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['symptom_date'] },
    { fields: ['user_id', 'symptom_date'] }
  ]
});

module.exports = Symptom;


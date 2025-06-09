const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DragonaProfile = sequelize.define('DragonaProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  diagnosis_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancer_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  treatment_stage: {
    type: DataTypes.ENUM('diagnosis', 'treatment', 'recovery', 'maintenance', 'survivor'),
    allowNull: true
  },
  emergency_contact_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  medical_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  privacy_settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      share_with_doctors: true,
      public_profile: false,
      show_in_community: true
    }
  }
}, {
  tableName: 'dragona_profiles',
  timestamps: true,
  underscored: true
});

module.exports = DragonaProfile;


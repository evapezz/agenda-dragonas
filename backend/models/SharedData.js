const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SharedData = sequelize.define('SharedData', {
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
  data_type: {
    type: DataTypes.ENUM('symptoms', 'appointments', 'motivational', 'profile'),
    allowNull: false
  },
  shared_with_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  shared_with_role: {
    type: DataTypes.ENUM('medico', 'admin', 'public'),
    allowNull: true
  },
  data_content: {
    type: DataTypes.JSON,
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      read: true,
      write: false,
      delete: false
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'shared_data',
  timestamps: true,
  underscored: true
});

module.exports = SharedData;


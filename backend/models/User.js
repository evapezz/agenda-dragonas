const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('dragona', 'medico', 'admin'),
    allowNull: false,
    defaultValue: 'dragona'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['role'] }
  ]
});

module.exports = User;


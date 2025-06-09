const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SocialLink = sequelize.define('SocialLink', {
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
  platform: {
    type: DataTypes.ENUM('instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'website', 'other'),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  display_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'social_links',
  timestamps: true,
  underscored: true
});

module.exports = SocialLink;


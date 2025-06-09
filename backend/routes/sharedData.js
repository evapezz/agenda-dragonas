// backend/models/SharedData.js

module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const SharedData = sequelize.define('SharedData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dragonaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      field: 'dragona_id'
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      field: 'doctor_id'
    },
    dataType: {
      type: DataTypes.ENUM('symptoms','appointments','motivational','stickers','social'),
      allowNull: false,
      field: 'data_type'
    },
    isShared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_shared'
    }
  }, {
    tableName: 'shared_data',
    timestamps: false,
    underscored: true
  });

  return SharedData;
};

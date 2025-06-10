require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,      
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    define: {
      underscored: true,     
      timestamps: true
    },
    logging: false
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a MYSQL establecida correctamente');
    return true;
  } catch (err) {
    console.error(' No se pudo conectar a MYSQL:', err.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };

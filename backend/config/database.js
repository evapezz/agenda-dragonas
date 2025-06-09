require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,      // ej. “Agenda”
  process.env.DB_USER,      // ej. “root” o “Eva”
  process.env.DB_PASSWORD,  // puede quedar vacío
  {
    host: process.env.DB_HOST,      // ej. “127.0.0.1” o “mysql”
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    define: {
      underscored: true,     // usa created_at / updated_at
      timestamps: true
    },
    logging: false
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MYSQL establecida correctamente');
    return true;
  } catch (err) {
    console.error(' No se pudo conectar a MYSQL:', err.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };

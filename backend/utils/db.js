const mysql = require('mysql2/promise');

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'Eva',
  password: process.env.DB_PASSWORD || 'Dragonas',
  database: process.env.DB_DATABASE || 'Agenda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para verificar la conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
};

// Exportar el pool y la función de prueba
module.exports = {
  db: pool,
  testConnection
};

// tests/setup.js - Configuración global de tests
const { sequelize } = require('../config/database');

// Configuración global antes de todos los tests
beforeAll(async () => {
  // Configurar base de datos de test
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-for-testing';
  process.env.DB_NAME = 'agenda_dragonas_test';
  
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Recrear tablas para tests
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
});

// Limpieza después de todos los tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

// Configuración de timeout para tests
jest.setTimeout(30000);

// Mock de console.log para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error // Mantener errores visibles
};


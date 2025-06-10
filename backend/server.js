require('dotenv').config();
const express = require('express');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const appointmentsRoutes = require('./routes/appointments');
const symptomsRoutes = require('./routes/symptoms');
const motivationalRoutes = require('./routes/motivational');
const doctorDragonaRoutes = require('./routes/doctorDragona');
const doctorQuestionsRoutes = require('./routes/doctorQuestions');
const dragonaProfileRoutes = require('./routes/dragonaProfile');
const socialRoutes = require('./routes/social');
const stickersRoutes = require('./routes/stickers');
const sharedDataRoutes = require('./routes/sharedData');
const adminRoutes = require('./routes/admin');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  max: process.env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// CORS configurado para producción
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5173'],
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging en desarrollo
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/appointments', authMiddleware, appointmentsRoutes);
app.use('/api/symptoms', authMiddleware, symptomsRoutes);
app.use('/api/motivational', authMiddleware, motivationalRoutes);
app.use('/api/doctor-dragona', authMiddleware, doctorDragonaRoutes);
app.use('/api/doctor-questions', authMiddleware, doctorQuestionsRoutes);
app.use('/api/dragona-profile', authMiddleware, dragonaProfileRoutes);
app.use('/api/social', authMiddleware, socialRoutes);
app.use('/api/stickers', authMiddleware, stickersRoutes);
app.use('/api/shared-data', authMiddleware, sharedDataRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl 
  });
});

// Manejo global de errores
app.use(errorHandler);

// Inicialización del servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }
    
    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con MYSQL');
    
    // Iniciar servidor
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(` Servidor ejecutándose en puerto ${PORT}`);
      console.log(`Base de datos: MYSQL`);
      console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = (signal) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`\n Recibido ${signal}, cerrando servidor...`);
      }
      server.close(async () => {
        try {
          await sequelize.close();
          if (process.env.NODE_ENV !== 'production') {
            console.log(' Conexión a base de datos cerrada');
          }
          process.exit(0);
        } catch (error) {
          console.error(' Error al cerrar conexión:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Error al inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;


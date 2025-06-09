const express = require('express');
const router = express.Router();
const { User, Appointment, Symptom, MotivationalContent } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Middleware para verificar que el usuario es admin
router.use(authenticateToken);
router.use(requireRole('admin'));

// Obtener estadísticas generales del sistema
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalDragonas,
      totalDoctors,
      totalAppointments,
      totalSymptoms,
      activeUsers
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: 'dragona' } }),
      User.count({ where: { role: 'medico' } }),
      Appointment.count(),
      Symptom.count(),
      User.count({ where: { is_active: true } })
    ]);

    res.json({
      totalUsers,
      totalDragonas,
      totalDoctors,
      totalAppointments,
      totalSymptoms,
      activeUsers
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener lista de todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, role, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (status !== undefined) whereClause.is_active = status === 'active';

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      total: users.count,
      page: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles de un usuario específico
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Appointment,
          as: 'appointments',
          limit: 5,
          order: [['date', 'DESC']]
        },
        {
          model: Symptom,
          as: 'symptoms',
          limit: 5,
          order: [['date', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar estado de un usuario
router.patch('/users/:id', async (req, res) => {
  try {
    const { is_active, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitir desactivar al propio admin
    if (user.id === req.user.id && is_active === false) {
      return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
    }

    // No permitir cambiar el rol de otros admins
    if (user.role === 'admin' && role && role !== 'admin' && user.id !== req.user.id) {
      return res.status(400).json({ error: 'No puedes cambiar el rol de otros administradores' });
    }

    const updateData = {};
    if (is_active !== undefined) updateData.is_active = is_active;
    if (role && ['dragona', 'medico', 'admin'].includes(role)) updateData.role = role;

    await user.update(updateData);

    res.json({ message: 'Usuario actualizado correctamente', user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un usuario
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitir eliminar al propio admin
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    // No permitir eliminar otros admins
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'No puedes eliminar otros administradores' });
    }

    await user.destroy();

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener grupos de comunidad
router.get('/groups', async (req, res) => {
  try {
    // Por ahora retornamos datos simulados ya que no tenemos modelo de grupos
    // En una implementación real, esto vendría de la base de datos
    const groups = [
      {
        id: 1,
        name: 'Apoyo Emocional',
        description: 'Grupo para compartir experiencias y apoyo mutuo',
        category: 'apoyo',
        isPrivate: false,
        memberCount: 15,
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Información Médica',
        description: 'Compartir información y recursos médicos',
        category: 'informativo',
        isPrivate: false,
        memberCount: 23,
        createdAt: new Date()
      },
      {
        id: 3,
        name: 'Actividades y Ejercicios',
        description: 'Rutinas de ejercicio y actividades recomendadas',
        category: 'actividades',
        isPrivate: true,
        memberCount: 8,
        createdAt: new Date()
      }
    ];

    res.json(groups);
  } catch (error) {
    console.error('Error getting groups:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo grupo
router.post('/groups', async (req, res) => {
  try {
    const { name, description, category, isPrivate } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }

    // Simulación de creación de grupo
    // En una implementación real, esto se guardaría en la base de datos
    const newGroup = {
      id: Date.now(), // ID temporal
      name,
      description,
      category: category || 'general',
      isPrivate: isPrivate || false,
      memberCount: 0,
      createdAt: new Date(),
      createdBy: req.user.id
    };

    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar grupo
router.delete('/groups/:id', async (req, res) => {
  try {
    // Simulación de eliminación de grupo
    // En una implementación real, esto eliminaría el grupo de la base de datos
    res.json({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener reportes y estadísticas avanzadas
router.get('/reports/activity', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Estadísticas de actividad de usuarios
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      newUsersLast30Days,
      activeUsersLast7Days,
      symptomsThisWeek,
      appointmentsThisMonth,
      reflectionsCompleted
    ] = await Promise.all([
      User.count({
        where: {
          createdAt: {
            [require('sequelize').Op.gte]: thirtyDaysAgo
          }
        }
      }),
      User.count({
        where: {
          last_login: {
            [require('sequelize').Op.gte]: sevenDaysAgo
          }
        }
      }),
      Symptom.count({
        where: {
          createdAt: {
            [require('sequelize').Op.gte]: sevenDaysAgo
          }
        }
      }),
      Appointment.count({
        where: {
          createdAt: {
            [require('sequelize').Op.gte]: thirtyDaysAgo
          }
        }
      }),
      MotivationalContent.count({
        where: {
          createdAt: {
            [require('sequelize').Op.gte]: sevenDaysAgo
          }
        }
      })
    ]);

    res.json({
      newUsersLast30Days,
      activeUsersLast7Days,
      symptomsThisWeek,
      appointmentsThisMonth,
      reflectionsCompleted,
      averageSessionsPerUser: 3.2 // Calculado dinámicamente en implementación real
    });
  } catch (error) {
    console.error('Error getting activity reports:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;


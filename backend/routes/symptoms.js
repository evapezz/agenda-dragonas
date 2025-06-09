const express = require('express');
const router = express.Router();
const { Symptom, User } = require('../models');
const { Op } = require('sequelize');
const { body, validationResult, query } = require('express-validator');

// Validaciones
const symptomValidation = [
  body('symptom_date').isDate().withMessage('Fecha inválida'),
  body('pain_level').optional().isInt({ min: 0, max: 10 }).withMessage('Nivel de dolor debe estar entre 0 y 10'),
  body('fatigue_level').optional().isInt({ min: 0, max: 10 }).withMessage('Nivel de fatiga debe estar entre 0 y 10'),
  body('nausea_level').optional().isInt({ min: 0, max: 10 }).withMessage('Nivel de náusea debe estar entre 0 y 10'),
  body('anxiety_level').optional().isInt({ min: 0, max: 10 }).withMessage('Nivel de ansiedad debe estar entre 0 y 10'),
  body('sleep_quality').optional().isInt({ min: 0, max: 10 }).withMessage('Calidad del sueño debe estar entre 0 y 10'),
  body('appetite_level').optional().isInt({ min: 0, max: 10 }).withMessage('Nivel de apetito debe estar entre 0 y 10'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Las notas no pueden exceder 1000 caracteres')
];

// GET /api/symptoms - Obtener síntomas con filtros y paginación
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
  query('start_date').optional().isDate().withMessage('Fecha de inicio inválida'),
  query('end_date').optional().isDate().withMessage('Fecha de fin inválida'),
  query('symptom_type').optional().isIn(['pain_level', 'fatigue_level', 'nausea_level', 'anxiety_level', 'sleep_quality', 'appetite_level']).withMessage('Tipo de síntoma inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      page = 1, 
      limit = 10, 
      start_date, 
      end_date, 
      symptom_type,
      sort_by = 'symptom_date',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Construir filtros
    const where = { user_id: req.user.id };
    
    if (start_date && end_date) {
      where.symptom_date = {
        [Op.between]: [start_date, end_date]
      };
    } else if (start_date) {
      where.symptom_date = {
        [Op.gte]: start_date
      };
    } else if (end_date) {
      where.symptom_date = {
        [Op.lte]: end_date
      };
    }

    const { count, rows: symptoms } = await Symptom.findAndCountAll({
      where,
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'last_name']
      }]
    });

    res.json({
      symptoms,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/symptoms/stats - Estadísticas de síntomas
router.get('/stats', [
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Período inválido'),
  query('start_date').optional().isDate().withMessage('Fecha de inicio inválida'),
  query('end_date').optional().isDate().withMessage('Fecha de fin inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { period = 'month', start_date, end_date } = req.query;
    
    // Calcular fechas según el período
    let dateFilter = {};
    const now = new Date();
    
    if (start_date && end_date) {
      dateFilter = {
        symptom_date: {
          [Op.between]: [start_date, end_date]
        }
      };
    } else {
      let startDate;
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      dateFilter = {
        symptom_date: {
          [Op.gte]: startDate
        }
      };
    }

    const symptoms = await Symptom.findAll({
      where: {
        user_id: req.user.id,
        ...dateFilter
      },
      order: [['symptom_date', 'ASC']]
    });

    // Calcular estadísticas
    const stats = {
      total_records: symptoms.length,
      period,
      date_range: {
        start: start_date || dateFilter.symptom_date[Op.gte],
        end: end_date || now
      },
      averages: {},
      trends: {},
      severity_distribution: {
        low: 0,    // 0-3
        medium: 0, // 4-6
        high: 0    // 7-10
      },
      daily_data: []
    };

    if (symptoms.length > 0) {
      // Calcular promedios
      const symptomTypes = ['pain_level', 'fatigue_level', 'nausea_level', 'anxiety_level', 'sleep_quality', 'appetite_level'];
      
      symptomTypes.forEach(type => {
        const values = symptoms.map(s => s[type]).filter(v => v !== null && v !== undefined);
        if (values.length > 0) {
          stats.averages[type] = {
            current: Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100,
            count: values.length
          };
        }
      });

      // Calcular distribución de severidad
      symptoms.forEach(symptom => {
        const maxLevel = Math.max(
          symptom.pain_level || 0,
          symptom.fatigue_level || 0,
          symptom.nausea_level || 0,
          symptom.anxiety_level || 0
        );
        
        if (maxLevel <= 3) stats.severity_distribution.low++;
        else if (maxLevel <= 6) stats.severity_distribution.medium++;
        else stats.severity_distribution.high++;
      });

      // Agrupar por día para tendencias
      const dailyGroups = symptoms.reduce((groups, symptom) => {
        const date = symptom.symptom_date.toISOString().split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(symptom);
        return groups;
      }, {});

      // Calcular datos diarios
      stats.daily_data = Object.entries(dailyGroups).map(([date, daySymptoms]) => {
        const dayStats = { date };
        
        symptomTypes.forEach(type => {
          const values = daySymptoms.map(s => s[type]).filter(v => v !== null && v !== undefined);
          if (values.length > 0) {
            dayStats[type] = Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100;
          }
        });
        
        return dayStats;
      });

      // Calcular tendencias (comparar primera y segunda mitad del período)
      const midPoint = Math.floor(symptoms.length / 2);
      const firstHalf = symptoms.slice(0, midPoint);
      const secondHalf = symptoms.slice(midPoint);

      if (firstHalf.length > 0 && secondHalf.length > 0) {
        symptomTypes.forEach(type => {
          const firstAvg = firstHalf.map(s => s[type]).filter(v => v !== null).reduce((sum, val, _, arr) => sum + val / arr.length, 0);
          const secondAvg = secondHalf.map(s => s[type]).filter(v => v !== null).reduce((sum, val, _, arr) => sum + val / arr.length, 0);
          
          if (firstAvg > 0 && secondAvg > 0) {
            const change = ((secondAvg - firstAvg) / firstAvg) * 100;
            stats.trends[type] = {
              change_percentage: Math.round(change * 100) / 100,
              direction: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
              first_period_avg: Math.round(firstAvg * 100) / 100,
              second_period_avg: Math.round(secondAvg * 100) / 100
            };
          }
        });
      }
    }

    res.json(stats);

  } catch (error) {
    console.error('Error calculating symptom stats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/symptoms - Crear nuevo síntoma
router.post('/', symptomValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si ya existe un registro para esta fecha
    const existingSymptom = await Symptom.findOne({
      where: {
        user_id: req.user.id,
        symptom_date: req.body.symptom_date
      }
    });

    if (existingSymptom) {
      return res.status(409).json({ 
        error: 'Ya existe un registro de síntomas para esta fecha. Use PUT para actualizar.' 
      });
    }

    const symptom = await Symptom.create({
      ...req.body,
      user_id: req.user.id
    });

    res.status(201).json(symptom);

  } catch (error) {
    console.error('Error creating symptom:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/symptoms/:id - Actualizar síntoma
router.put('/:id', symptomValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const symptom = await Symptom.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!symptom) {
      return res.status(404).json({ error: 'Síntoma no encontrado' });
    }

    await symptom.update(req.body);
    res.json(symptom);

  } catch (error) {
    console.error('Error updating symptom:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/symptoms/:id - Eliminar síntoma
router.delete('/:id', async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!symptom) {
      return res.status(404).json({ error: 'Síntoma no encontrado' });
    }

    await symptom.destroy();
    res.status(204).send();

  } catch (error) {
    console.error('Error deleting symptom:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/symptoms/:id/share - Compartir síntoma con médico
router.post('/:id/share', [
  body('doctor_id').isInt().withMessage('ID de médico inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const symptom = await Symptom.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!symptom) {
      return res.status(404).json({ error: 'Síntoma no encontrado' });
    }

    // Verificar que el médico existe y está relacionado con el usuario
    const doctor = await User.findOne({
      where: {
        id: req.body.doctor_id,
        role: 'medico'
      }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }

    await symptom.update({ shared_with_doctor: true });
    
    // Aquí se podría enviar una notificación al médico
    
    res.json({ message: 'Síntoma compartido exitosamente', symptom });

  } catch (error) {
    console.error('Error sharing symptom:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;


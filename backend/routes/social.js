const express = require('express');
const router = express.Router();
const { db } = require('../utils/db');
const authMiddleware= require('../middleware/authMiddleware');
const {
  getAllForUser,
  getPublicForUser,
  upsertLink,
  deleteLink
} = require('../controllers/SocialController');


router.use(authMiddleware);
router.get('/user/:userId', getAllForUser);
router.get('/user/:userId/public', getPublicForUser);
router.post('/', upsertLink);
router.delete('/:id', deleteLink);



// Obtener todos los enlaces sociales de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const [socialLinks] = await db.query(
      'SELECT * FROM social_links WHERE user_id = ?',
      [req.params.userId]
    );
    res.json(socialLinks);
  } catch (error) {
    console.error('Error al obtener enlaces sociales:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Obtener enlaces sociales públicos de un usuario
router.get('/user/:userId/public', async (req, res) => {
  try {
    const [socialLinks] = await db.query(
      'SELECT * FROM social_links WHERE user_id = ? AND is_public = true',
      [req.params.userId]
    );
    res.json(socialLinks);
  } catch (error) {
    console.error('Error al obtener enlaces sociales públicos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Crear o actualizar un enlace social
router.post('/', async (req, res) => {
  try {
    const { user_id, platform, url, username, is_public } = req.body;
    
    if (!user_id || !platform || !url) {
      return res.status(400).json({ message: 'Usuario, plataforma y URL son requeridos' });
    }
    
    // Verificar si ya existe un enlace para esta plataforma y usuario
    const [existingLinks] = await db.query(
      'SELECT * FROM social_links WHERE user_id = ? AND platform = ?',
      [user_id, platform]
    );
    
    if (existingLinks.length > 0) {
      // Actualizar enlace existente
      const [result] = await db.query(
        'UPDATE social_links SET url = ?, username = ?, is_public = ? WHERE user_id = ? AND platform = ?',
        [url, username, is_public, user_id, platform]
      );
      
      if (result.affectedRows === 1) {
        res.json({ message: 'Enlace social actualizado exitosamente' });
      } else {
        res.status(500).json({ message: 'Error al actualizar enlace social' });
      }
    } else {
      // Crear nuevo enlace
      const [result] = await db.query(
        'INSERT INTO social_links (user_id, platform, url, username, is_public) VALUES (?, ?, ?, ?, ?)',
        [user_id, platform, url, username, is_public]
      );
      
      if (result.affectedRows === 1) {
        res.status(201).json({ 
          id: result.insertId,
          message: 'Enlace social creado exitosamente' 
        });
      } else {
        res.status(500).json({ message: 'Error al crear enlace social' });
      }
    }
  } catch (error) {
    console.error('Error al crear/actualizar enlace social:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Eliminar un enlace social
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM social_links WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enlace social no encontrado' });
    }
    
    res.json({ message: 'Enlace social eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar enlace social:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;

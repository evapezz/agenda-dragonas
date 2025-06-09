// proyecto/backend/controllers/UserController.js

const { db } = require('../utils/db');

module.exports = {
  // 1) Listar todos los usuarios
  listAll: async (req, res) => {
    try {
      const [users] = await db.query(
        'SELECT id, username, name, last_name AS lastName, email, role FROM users'
      );
      res.json(users);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // 2) Obtener un usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      // Solo el propio usuario o un admin podrían ver esto. Aquí asumimos que ya está autenticado.
      // Podria validar que req.user.id === parseInt(id) u otro criterio.
      const [rows] = await db.query(
        'SELECT id, username, name, last_name AS lastName, email, profile_image AS profileImage, role FROM users WHERE id = ?',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // 3) Actualizar un usuario por ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, lastName, email } = req.body;

      // Validaciones mínimas
      if (!name || !lastName || !email) {
        return res
          .status(400)
          .json({ message: 'Nombre, apellidos y correo son obligatorios.' });
      }

      // Opcional: validar formato de email con regex 
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (!emailRegex.test(email)) {
      //   return res.status(400).json({ message: 'Correo inválido.' });
      // }

      // Actualizar en la base de datos
      const [result] = await db.query(
        'UPDATE users SET name = ?, last_name = ?, email = ? WHERE id = ?',
        [name, lastName, email, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Recuperar el usuario actualizado para devolverlo
      const [rows] = await db.query(
        'SELECT id, username, name, last_name AS lastName, email, profile_image AS profileImage, role FROM users WHERE id = ?',
        [id]
      );
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // 4) Listar dragona (rol = 'dragona')
  listDragonas: async (req, res) => {
    try {
      const [dragonas] = await db.query(
        "SELECT id, username, name, last_name AS lastName, email FROM users WHERE role = 'dragona'"
      );
      res.json(dragonas);
    } catch (error) {
      console.error('Error al listar dragonas:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // 5) Listar médicos (rol = 'medico')
  listDoctors: async (req, res) => {
    try {
      const [doctors] = await db.query(
        "SELECT id, username, name, last_name AS lastName, email FROM users WHERE role = 'medico'"
      );
      res.json(doctors);
    } catch (error) {
      console.error('Error al listar médicos:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

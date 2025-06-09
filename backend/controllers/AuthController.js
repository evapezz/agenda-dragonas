const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Actualizar último login
    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        role: user.role,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, name, last_name, role = 'dragona' } = req.body;

    // Validaciones
    if (!username || !email || !password || !name || !last_name) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El usuario o email ya existe' 
      });
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      last_name,
      role: ['dragona', 'medico', 'admin'].includes(role) ? role : 'dragona'
    });

    // Generar token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        last_name: newUser.last_name,
        role: newUser.role,
        profile_image: newUser.profile_image
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Datos de entrada inválidos',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const { username, email, password, name, lastName } = req.body;

    // Validaciones básicas
    if (!username || !email || !password || !name || !lastName) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? 'El nombre de usuario ya existe' 
          : 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario médico
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      last_name: lastName,
      role: 'medico'
    });

    // Generar token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Médico registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        last_name: newUser.last_name,
        role: newUser.role,
        profile_image: newUser.profile_image
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Datos de entrada inválidos',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        role: user.role,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const logout = async (req, res) => {
  try {
    // En una implementación real, aquí se podría invalidar el token
    // Por ahora, simplemente confirmamos el logout
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  login,
  register,
  registerDoctor,
  verify: verifyToken,
  logout
};


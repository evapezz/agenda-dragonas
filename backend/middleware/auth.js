const jwt = require('jsonwebtoken');

// Middleware de autenticación básico
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Middleware para verificar roles específicos
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere rol: ${role}`,
        userRole: req.user.role 
      });
    }

    next();
  };
}

// Middleware para verificar múltiples roles
function requireAnyRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere uno de los roles: ${roles.join(', ')}`,
        userRole: req.user.role 
      });
    }

    next();
  };
}

// Middleware para verificar que el usuario es propietario del recurso o admin
function requireOwnershipOrAdmin(getUserIdFromParams = (req) => req.params.userId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const resourceUserId = getUserIdFromParams(req);
    const isOwner = req.user.id === parseInt(resourceUserId);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        error: 'Acceso denegado. Solo el propietario o un administrador pueden acceder a este recurso' 
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  requireAnyRole,
  requireOwnershipOrAdmin,
  // Mantener compatibilidad con el middleware anterior
  authMiddleware: authenticateToken
};


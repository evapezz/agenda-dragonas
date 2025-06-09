// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Mientras se carga el estado de autenticación, muestro "Cargando..."
  if (loading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  // Si no hay usuario logueado, redirijo a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se pide un rol específico y el user.role no coincide, lo envío a /dashboard
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si pasa todas las comprobaciones, muestro el children
  return children;
};

export default ProtectedRoute;

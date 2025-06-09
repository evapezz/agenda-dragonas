// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RegisterDoctor from './pages/RegisterDoctor.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Appointments from './pages/Appointments.jsx';
import Symptoms from './pages/Symptoms.jsx';
import Motivational from './pages/Motivational.jsx';
import Comunidad from './pages/Comunidad.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Header />
      <div className="flex-grow-1 py-3">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          
          {/* Ruta para la política de privacidad */}
          <Route 
            path="/politica-privacidad" 
            element={
              <div style={{ height: '100vh' }}>
                <iframe 
                  src="/politica-privacidad.html" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Política de Privacidad"
                />
              </div>
            } 
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/motivacion"
            element={
              <ProtectedRoute>
                <Motivational />
              </ProtectedRoute>
            }
          />

          <Route
            path="/comunidad"
            element={
              <ProtectedRoute role="dragona">
                <Comunidad />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas"
            element={
              <ProtectedRoute role="dragona">
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sintomas"
            element={
              <ProtectedRoute role="dragona">
                <Symptoms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute role="medico">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}


// frontend/src/components/Header.jsx 

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Navbar expand="lg" expanded={expanded} className="navbar-light bg-white shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/favicon.svg"
            alt="Agenda de Dragonas"
            className="me-2"
            style={{ height: '40px' }}
          />
          <span className="fw-bold text-primary">Agenda de Dragonas</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" onClick={() => setExpanded(false)} className="px-3">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Nav.Link>
                
                {user.role === 'dragona' && (
                  <>
                    <Nav.Link as={Link} to="/citas" onClick={() => setExpanded(false)} className="px-3">
                      <i className="bi bi-calendar-check me-1"></i> Agenda
                    </Nav.Link>
                    <Nav.Link as={Link} to="/sintomas" onClick={() => setExpanded(false)} className="px-3">
                      <i className="bi bi-journal-medical me-1"></i> Salud
                    </Nav.Link>
                  </>
                )}
                
                {user.role === 'medico' && (
                  <Nav.Link as={Link} to="/doctor" onClick={() => setExpanded(false)} className="px-3">
                    <i className="bi bi-clipboard2-pulse me-1"></i> Panel Médico
                  </Nav.Link>
                )}
                
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)} className="px-3">
                    <i className="bi bi-shield-check me-1"></i> Administración
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/motivacion" onClick={() => setExpanded(false)} className="px-3">
                  <i className="bi bi-heart me-1"></i> Motivación
                </Nav.Link>
                
                <Nav.Link as={Link} to="/comunidad" onClick={() => setExpanded(false)} className="px-3">
                  <i className="bi bi-people me-1"></i> Comunidad
                </Nav.Link>
                
                <Dropdown align="end" className="ms-lg-2">
                  <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer">
                    <div className="d-flex align-items-center border rounded-pill py-1 px-3 bg-light">
                      <div className="position-relative me-2">
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                          style={{ width: '32px', height: '32px', fontSize: '14px' }}
                        >
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span 
                          className={`position-absolute bottom-0 end-0 rounded-circle p-1 border border-white ${
                            user.role === 'dragona' ? 'bg-primary' : 'bg-success'
                          }`}
                          style={{ width: '10px', height: '10px' }}
                        ></span>
                      </div>
                      <span className="d-none d-md-inline">{user.name}</span>
                      <i className="bi bi-chevron-down ms-2 small"></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0 rounded-3 mt-2">
                    <Dropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                      <i className="bi bi-person me-2"></i> Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings" onClick={() => setExpanded(false)}>
                      <i className="bi bi-gear me-2"></i> Configuración
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { handleLogout(); setExpanded(false); }}>
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)} className="px-3">
                  Iniciar Sesión
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-lg-2 mt-2 mt-lg-0"
                  onClick={() => setExpanded(false)}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;


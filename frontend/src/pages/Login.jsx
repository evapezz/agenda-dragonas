import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  InputGroup,
} from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // Estados de inputs y errores - CAMPOS VACÍOS SIEMPRE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [formError, setFormError] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // Limpiar TODOS los campos al montar el componente
  useEffect(() => {
    // Limpiar campos del formulario
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setUsernameError('');
    setFormError('');
    setPrivacyChecked(false);
    
    // Limpiar cualquier autocompletado del navegador
    const usernameInput = document.getElementById('formUsername');
    const passwordInput = document.getElementById('formPassword');
    
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
  }, []);

  // Si ya hay usuario autenticado, redirigir según su rol
  useEffect(() => {
    if (user) {
      if (user.role === 'medico') {
        navigate('/doctor');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setUsernameError('');

    // Validaciones básicas
    if (!username.trim() || !password) {
      setFormError('Usuario y contraseña son obligatorios.');
      return;
    }

    if (!privacyChecked) {
      setFormError('Debes aceptar la política de privacidad.');
      return;
    }

    try {
      const userData = await login(username.trim(), password);
      
      // Redirigir según el rol del usuario
      if (userData.role === 'medico') {
        navigate('/doctor');
      } else if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setFormError(
        err.response?.data?.message || 'Credenciales inválidas o error de conexión'
      );
    }
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: -1,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src="/tinta.mp4" type="video/mp4" />
          Tu navegador no soporta vídeos en HTML5.
        </video>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img src="/favicon.svg" alt="Logo" width="60" height="60" />
                  <h2 className="mt-3">Iniciar sesión</h2>
                  <p className="text-muted">Agenda Digital de Dragonas</p>
                </div>

                {formError && <Alert variant="danger">{formError}</Alert>}
                {usernameError && <Alert variant="warning">{usernameError}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* Campo de usuario */}
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escribe tu nombre de usuario"
                      value={username}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      isInvalid={!!usernameError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {usernameError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo de contraseña */}
                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {/* Checkbox de política de privacidad */}
                  <Form.Group className="mb-3" controlId="formPrivacy">
                    <Form.Check
                      type="checkbox"
                      label={
                        <>
                          Acepto la{' '}
                          <Link to="/politica-privacidad" target="_blank">
                            política de privacidad
                          </Link>
                        </>
                      }
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={!privacyChecked}
                    >
                      Entrar
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <p>
                      ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                    </p>
                    <p>
                      ¿Eres médico?{' '}
                      <Link to="/register-doctor">Regístrate como Médico</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;


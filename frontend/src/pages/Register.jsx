// frontend/src/pages/Register.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';  // ← Usamos nuestra instancia de Axios

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones básicas
    if (!name || !lastName || !username || !email || !password || !confirmPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Debes aceptar los términos y condiciones.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Llamada a backend con Axios
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        name,
        last_Name: lastName
      });

      // Si no es OK, api arroja excepción; si llega aquí, fue 201
      setSuccessMsg('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Captura error de Axios
      const data = err.response?.data;
      setErrorMsg(data?.message || 'Error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <img src="/favicon.svg" alt="Logo" width="60" height="60" />
                <h2 className="mt-3">Únete a Agenda de Dragones</h2>
                <p className="text-muted">Crea tu cuenta para comenzar tu viaje</p>
              </div>
              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
              {successMsg && <Alert variant="success">{successMsg}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formLastName">
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tus apellidos"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    placeholder="Elige un nombre de usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Crea una contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Label>Confirmar contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirma tu contraseña"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="termsCheck">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        Acepto los{' '}
                        <Link to="/politica-privacidad" target="_blank">
                          términos y condiciones
                        </Link>
                      </>
                    }
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">
                    Registrarme
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p>
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;


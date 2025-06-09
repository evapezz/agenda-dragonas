// frontend/src/pages/DoctorDashboard.jsx 

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Badge,
  Modal,
  Form,
  Nav,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  Navbar,
  NavDropdown
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 1) Listado de pacientes (dragonas) vinculadas a este médico
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState('');

  // 2) Paciente seleccionado
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // 3) Estado para modal de invitación
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');
  
  // 4) Estado para búsqueda de pacientes
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // 5) Estado para modal de respuesta a preguntas
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  
  // 6) Estado para preguntas pendientes
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      setPatientsError('');

      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo para la demostración
        const mockPatients = [
          {
            id: 1,
            name: "Ana",
            lastName: "García",
            email: "ana.garcia@ejemplo.com",
            relationId: 101,
            lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
            symptomsCount: 12,
            questionsCount: 2,
            progress: 75
          },
          {
            id: 2,
            name: "María",
            lastName: "López",
            email: "maria.lopez@ejemplo.com",
            relationId: 102,
            lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
            symptomsCount: 8,
            questionsCount: 0,
            progress: 60
          },
          {
            id: 3,
            name: "Carmen",
            lastName: "Martínez",
            email: "carmen.martinez@ejemplo.com",
            relationId: 103,
            lastActivity: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            status: "inactive",
            symptomsCount: 3,
            questionsCount: 1,
            progress: 40
          },
          {
            id: 4,
            name: "Laura",
            lastName: "Sánchez",
            email: "laura.sanchez@ejemplo.com",
            relationId: 104,
            lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
            symptomsCount: 15,
            questionsCount: 0,
            progress: 85
          }
        ];
        
        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
      } catch (err) {
        console.error(err);
        setPatientsError('No se pudo cargar la lista de pacientes.');
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
    fetchPendingQuestions();
  }, []);
  
  // Cargar preguntas pendientes
  const fetchPendingQuestions = async () => {
    setLoadingQuestions(true);
    try {
      // Simulación de carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo para la demostración
      const mockQuestions = [
        {
          id: 1,
          patientId: 1,
          patientName: "Ana García",
          question: "¿Es normal sentir dolor de cabeza después de la quimioterapia?",
          createdAt: "2025-06-01T14:30:00Z",
          isAnswered: false
        },
        {
          id: 2,
          patientId: 3,
          patientName: "Carmen Martínez",
          question: "¿Puedo hacer ejercicio moderado durante el tratamiento?",
          createdAt: "2025-05-29T10:15:00Z",
          isAnswered: false
        },
        {
          id: 3,
          patientId: 1,
          patientName: "Ana García",
          question: "¿Cuándo debería programar mi próxima mamografía?",
          createdAt: "2025-05-27T16:45:00Z",
          isAnswered: false
        }
      ];
      
      setPendingQuestions(mockQuestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };
  
  // Filtrar pacientes cuando cambie el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(p => 
      p.name?.toLowerCase().includes(term) || 
      p.lastName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.id?.toString().includes(term)
    );
    
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };
  
  // Manejar invitación de paciente
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    
    setInviteLoading(true);
    setInviteSuccess(false);
    setInviteError('');
    
    try {
      // Simulación de envío de invitación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En implementación real aquí va la llamada a la API
      // await api.post('/doctor-dragona/invite', { email: inviteEmail, name: inviteName });
      
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteName('');
        setInviteSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setInviteError('No se pudo enviar la invitación. Inténtalo de nuevo.');
    } finally {
      setInviteLoading(false);
    }
  };
  
  // Manejar respuesta a pregunta
  const handleOpenAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    setShowAnswerModal(true);
  };
  
  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !selectedQuestion) return;
    
    setAnswerLoading(true);
    try {
      // Simulación de envío de respuesta
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar localmente
      const updatedQuestions = pendingQuestions.filter(q => q.id !== selectedQuestion.id);
      setPendingQuestions(updatedQuestions);
      
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      setAnswerText('');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la respuesta');
    } finally {
      setAnswerLoading(false);
    }
  };
  
  // Formatear fecha relativa
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };
  
  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="doctor-dashboard">
      {/* Barra de navegación superior */}
      <Navbar bg="primary" variant="dark" expand="lg" className="doctor-navbar">
        <Container fluid>
          <Navbar.Brand href="#home">Panel Médico</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/doctor" active>Inicio</Nav.Link>
              <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || 'Usuario'}
                  </span>
                } 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        {/* Encabezado y estadísticas */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={7}>
                    <h1 className="doctor-title mb-2">Bienvenido/a, Dr. {user?.name || 'Usuario'}</h1>
                    <p className="text-muted">
                      Gestiona tus pacientes, responde a sus preguntas y revisa su progreso.
                    </p>
                  </Col>
                  <Col md={5}>
                    <div className="d-flex justify-content-md-end mt-3 mt-md-0">
                      <Button 
                        variant="primary" 
                        className="invite-btn"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Invitar paciente
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Preguntas pendientes destacadas */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Preguntas pendientes</h5>
                  <Badge bg="warning" pill className="px-3 py-2">{pendingQuestions.length}</Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loadingQuestions ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Cargando preguntas...</p>
                  </div>
                ) : pendingQuestions.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle" style={{ fontSize: '2rem', color: '#28a745' }}></i>
                    <p className="text-muted mt-2">No hay preguntas pendientes.</p>
                  </div>
                ) : (
                  <div className="pending-questions-list">
                    {pendingQuestions.map((q) => (
                      <div key={q.id} className="pending-question-item p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{q.question}</h6>
                            <p className="text-muted small mb-0">
                              <span className="fw-bold">{q.patientName}</span> - {formatRelativeDate(q.createdAt)}
                            </p>
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleOpenAnswerModal(q)}
                          >
                            <i className="bi bi-reply me-1"></i> Responder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
              {pendingQuestions.length > 0 && (
                <Card.Footer className="bg-white border-0 p-3 text-center">
                  <Button 
                    variant="primary" 
                    onClick={() => handleOpenAnswerModal(pendingQuestions[0])}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Responder preguntas
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>

        <Row>
          {/* ────── Columna: LISTA de Pacientes ────── */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Mis Pacientes</h5>
                  <Badge bg="primary" pill className="px-3 py-2">{filteredPatients.length}</Badge>
                </div>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </Form.Group>
              </Card.Header>

              <Card.Body className="patient-list-container px-2 pt-0">
                {loadingPatients ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Cargando pacientes...</p>
                  </div>
                ) : patientsError ? (
                  <Alert variant="danger" className="m-3">{patientsError}</Alert>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-search text-muted" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted mt-2">No se encontraron pacientes</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setShowInviteModal(true)}
                    >
                      Invitar nueva paciente
                    </Button>
                  </div>
                ) : (
                  <div className="patient-list">
                    {filteredPatients.map((p) => (
                      <Card 
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className={`patient-card mb-2 mx-2 ${selectedPatient?.id === p.id ? 'active' : ''}`}
                      >
                        <Card.Body className="py-2 px-3">
                          <div className="d-flex align-items-center">
                            <div className="patient-avatar me-3">
                              {p.avatar ? (
                                <img src={p.avatar} alt={p.name} className="rounded-circle" />
                              ) : (
                                <div className="avatar-placeholder">
                                  {p.name?.charAt(0)}{p.lastName?.charAt(0)}
                                </div>
                              )}
                              <span className={`status-indicator ${p.status === 'active' ? 'active' : 'inactive'}`}></span>
                            </div>
                            <div className="patient-info">
                              <h6 className="mb-0">{p.name} {p.lastName}</h6>
                              <small className="text-muted d-block">Última actividad: {formatRelativeDate(p.lastActivity)}</small>
                            </div>
                            <div className="ms-auto text-end">
                              <Badge 
                                bg={p.symptomsCount > 0 ? 'danger' : 'secondary'} 
                                className="me-1"
                                title="Síntomas registrados"
                              >
                                <i className="bi bi-activity me-1"></i>
                                {p.symptomsCount}
                              </Badge>
                              <Badge 
                                bg={p.questionsCount > 0 ? 'warning' : 'secondary'}
                                title="Preguntas pendientes"
                              >
                                <i className="bi bi-question-circle me-1"></i>
                                {p.questionsCount}
                              </Badge>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
              
              <Card.Footer className="bg-white border-0 p-3">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => setShowInviteModal(true)}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Invitar nueva paciente
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* ────── Columna: DETALLES del Paciente seleccionado ────── */}
          <Col lg={8}>
            {selectedPatient ? (
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="patient-avatar-lg me-3">
                        {selectedPatient.avatar ? (
                          <img src={selectedPatient.avatar} alt={selectedPatient.name} className="rounded-circle" />
                        ) : (
                          <div className="avatar-placeholder-lg">
                            {selectedPatient.name?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                          </div>
                        )}
                        <span className={`status-indicator ${selectedPatient.status === 'active' ? 'active' : 'inactive'}`}></span>
                      </div>
                      <div>
                        <h4 className="mb-0">{selectedPatient.name} {selectedPatient.lastName}</h4>
                        <p className="text-muted mb-0">
                          <i className="bi bi-envelope me-1"></i> {selectedPatient.email || 'No disponible'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        // Aquí la navegación a la página de síntomas de la paciente
                        alert(`Ver síntomas de ${selectedPatient.name} ${selectedPatient.lastName}`);
                      }}
                    >
                      <i className="bi bi-activity me-2"></i>
                      Ver síntomas
                    </Button>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Progreso general</span>
                      <span className="text-primary">{selectedPatient.progress}%</span>
                    </div>
                    <ProgressBar now={selectedPatient.progress} variant="primary" className="progress-bar-custom" />
                  </div>
                </Card.Header>
                
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6} className="mb-4">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <h5 className="mb-3">Resumen de síntomas</h5>
                          <div className="d-flex align-items-center mb-3">
                            <div className="stat-icon bg-danger-soft text-danger me-3">
                              <i className="bi bi-activity"></i>
                            </div>
                            <div>
                              <h6 className="mb-0">Total de síntomas registrados</h6>
                              <h3 className="mb-0">{selectedPatient.symptomsCount}</h3>
                            </div>
                          </div>
                          <Button 
                            variant="outline-primary" 
                            className="w-100"
                            onClick={() => {
                              // Aquí la navegación a la página de síntomas de la paciente
                              alert(`Ver síntomas de ${selectedPatient.name} ${selectedPatient.lastName}`);
                            }}
                          >
                            <i className="bi bi-graph-up me-2"></i>
                            Ver historial completo
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <h5 className="mb-3">Preguntas pendientes</h5>
                          {selectedPatient.questionsCount > 0 ? (
                            <>
                              <div className="d-flex align-items-center mb-3">
                                <div className="stat-icon bg-warning-soft text-warning me-3">
                                  <i className="bi bi-question-circle"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Preguntas sin responder</h6>
                                  <h3 className="mb-0">{selectedPatient.questionsCount}</h3>
                                </div>
                              </div>
                              <Button 
                                variant="outline-primary" 
                                className="w-100"
                                onClick={() => {
                                  // Buscar preguntas de esta paciente
                                  const patientQuestions = pendingQuestions.filter(q => q.patientId === selectedPatient.id);
                                  if (patientQuestions.length > 0) {
                                    handleOpenAnswerModal(patientQuestions[0]);
                                  } else {
                                    alert("No se encontraron preguntas pendientes para esta paciente.");
                                  }
                                }}
                              >
                                <i className="bi bi-reply me-2"></i>
                                Responder preguntas
                              </Button>
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <i className="bi bi-check-circle" style={{ fontSize: '2rem', color: '#28a745' }}></i>
                              <p className="text-muted mt-2">No hay preguntas pendientes de esta paciente.</p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body>
                          <h5 className="mb-3">Notas clínicas</h5>
                          <Form>
                            <Form.Group className="mb-3">
                              <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Añade notas clínicas privadas sobre esta paciente..."
                              />
                            </Form.Group>
                            <div className="text-end">
                              <Button variant="primary">
                                <i className="bi bi-save me-1"></i> Guardar notas
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                  <div className="empty-state-icon mb-4">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <h4>Selecciona una paciente</h4>
                  <p className="text-muted mb-4">
                    Selecciona una paciente de la lista para ver sus detalles, síntomas y estadísticas.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowInviteModal(true)}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Invitar nueva paciente
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      
      {/* Modal de invitación */}
      <Modal 
        show={showInviteModal} 
        onHide={() => {
          if (!inviteLoading) {
            setShowInviteModal(false);
            setInviteEmail('');
            setInviteName('');
            setInviteError('');
            setInviteSuccess(false);
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invitar nueva paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inviteSuccess ? (
            <Alert variant="success">
              <div className="text-center py-3">
                <i className="bi bi-check-circle" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">¡Invitación enviada!</h5>
                <p className="mb-0">Se ha enviado un enlace de registro a {inviteEmail}.</p>
              </div>
            </Alert>
          ) : (
            <Form onSubmit={handleInviteSubmit}>
              {inviteError && <Alert variant="danger">{inviteError}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la paciente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. María García"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  disabled={inviteLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={inviteLoading}
                />
                <Form.Text className="text-muted">
                  Se enviará un enlace de registro a este correo electrónico.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mensaje personalizado (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Añade un mensaje personalizado a la invitación..."
                  disabled={inviteLoading}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!inviteSuccess && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowInviteModal(false)}
                disabled={inviteLoading}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleInviteSubmit}
                disabled={inviteLoading || !inviteEmail || !inviteName}
              >
                {inviteLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-2"></i>
                    Enviar invitación
                  </>
                )}
              </Button>
            </>
          )}
          {inviteSuccess && (
            <Button 
              variant="primary" 
              onClick={() => {
                setShowInviteModal(false);
                setInviteEmail('');
                setInviteName('');
                setInviteSuccess(false);
              }}
            >
              Cerrar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      
      {/* Modal para responder preguntas */}
      <Modal 
        show={showAnswerModal} 
        onHide={() => {
          if (!answerLoading) {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
            setAnswerText('');
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Responder pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestion && (
            <>
              <div className="question-container p-3 bg-light rounded mb-3">
                <h6 className="mb-1">{selectedQuestion.question}</h6>
                <p className="text-muted small mb-0">
                  <span className="fw-bold">{selectedQuestion.patientName}</span> - {formatRelativeDate(selectedQuestion.createdAt)}
                </p>
              </div>
              
              <Form.Group>
                <Form.Label>Tu respuesta</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  disabled={answerLoading}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowAnswerModal(false)}
            disabled={answerLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitAnswer}
            disabled={answerLoading || !answerText.trim()}
          >
            {answerLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                Enviando...
              </>
            ) : (
              'Enviar respuesta'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;

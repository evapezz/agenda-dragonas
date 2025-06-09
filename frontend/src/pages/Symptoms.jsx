import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal, Alert, Spinner, Nav, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Symptoms = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('register');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para registro de síntomas
  const [newSymptom, setNewSymptom] = useState({
    date: new Date().toISOString().split('T')[0],
    pain_level: 0,
    fatigue_level: 0,
    nausea_level: 0,
    anxiety_level: 0,
    sleep_level: 0,
    appetite_level: 0,
    notes: ''
  });

  // Estados para compartir con médicos
  const [sharedDoctors, setSharedDoctors] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [emailData, setEmailData] = useState({
    doctorId: '',
    subject: '',
    message: '',
    includePeriod: '7',
    includeSymptoms: true
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    permissions: ['view']
  });

  // Estados para estadísticas
  const [chartType, setChartType] = useState('line');
  const [chartPeriod, setChartPeriod] = useState('30');

  useEffect(() => {
    loadSymptoms();
    loadSharedDoctors();
  }, []);

  const loadSymptoms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/symptoms');
      setSymptoms(response.data);
    } catch (error) {
      setError('Error al cargar síntomas');
      console.error('Error loading symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSharedDoctors = async () => {
    try {
      const response = await api.get('/symptoms/shared-doctors');
      setSharedDoctors(response.data);
    } catch (error) {
      console.error('Error loading shared doctors:', error);
    }
  };

  const handleSubmitSymptom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/symptoms', newSymptom);
      
      setSuccess('Síntoma registrado correctamente');
      setNewSymptom({
        date: new Date().toISOString().split('T')[0],
        pain_level: 0,
        fatigue_level: 0,
        nausea_level: 0,
        anxiety_level: 0,
        sleep_level: 0,
        appetite_level: 0,
        notes: ''
      });
      
      await loadSymptoms();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al registrar síntoma');
      console.error('Error submitting symptom:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/symptoms/send-email', emailData);
      setSuccess('Email enviado correctamente al médico');
      setShowEmailModal(false);
      setEmailData({
        doctorId: '',
        subject: '',
        message: '',
        includePeriod: '7',
        includeSymptoms: true
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al enviar email');
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteDoctor = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/symptoms/invite-doctor', inviteData);
      setSuccess('Invitación enviada correctamente');
      setShowInviteModal(false);
      setInviteData({
        email: '',
        name: '',
        permissions: ['view']
      });
      await loadSharedDoctors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al enviar invitación');
      console.error('Error inviting doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityLevel = (level) => {
    if (level <= 3) return { text: 'Leve', color: 'success' };
    if (level <= 6) return { text: 'Moderado', color: 'warning' };
    return { text: 'Intenso', color: 'danger' };
  };

  const getChartData = () => {
    const days = parseInt(chartPeriod);
    const filteredSymptoms = symptoms
      .filter(s => {
        const symptomDate = new Date(s.date);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return symptomDate >= cutoffDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10); // Últimos 10 registros

    return filteredSymptoms.map(symptom => ({
      date: new Date(symptom.date).toLocaleDateString(),
      Dolor: symptom.pain_level,
      Fatiga: symptom.fatigue_level,
      Náusea: symptom.nausea_level,
      Ansiedad: symptom.anxiety_level,
      Sueño: symptom.sleep_level,
      Apetito: symptom.appetite_level
    }));
  };

  const symptomColors = {
    Dolor: '#dc3545',
    Fatiga: '#fd7e14',
    Náusea: '#ffc107',
    Ansiedad: '#6f42c1',
    Sueño: '#0dcaf0',
    Apetito: '#198754'
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <img 
              src="/images/0.jpg" 
              alt="Fortaleza y Determinación" 
              className="rounded-circle me-3"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
            <div>
              <h2 className="mb-1">Registro de Síntomas</h2>
              <p className="text-muted mb-0">Monitorea tu bienestar y comparte con tu equipo médico</p>
            </div>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'register'} 
                onClick={() => setActiveTab('register')}
              >
                <i className="bi bi-plus-circle me-2"></i>Registrar
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
              >
                <i className="bi bi-clock-history me-2"></i>Historial
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'share'} 
                onClick={() => setActiveTab('share')}
              >
                <i className="bi bi-share me-2"></i>Compartir
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'register' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Nuevo Registro de Síntomas</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmitSymptom}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                          type="date"
                          value={newSymptom.date}
                          onChange={(e) => setNewSymptom({...newSymptom, date: e.target.value})}
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {[
                      { key: 'pain_level', label: 'Nivel de Dolor', icon: 'bi-lightning' },
                      { key: 'fatigue_level', label: 'Fatiga', icon: 'bi-battery-half' },
                      { key: 'nausea_level', label: 'Náusea', icon: 'bi-emoji-dizzy' },
                      { key: 'anxiety_level', label: 'Ansiedad', icon: 'bi-heart-pulse' },
                      { key: 'sleep_level', label: 'Calidad del Sueño', icon: 'bi-moon' },
                      { key: 'appetite_level', label: 'Apetito', icon: 'bi-cup-hot' }
                    ].map(symptom => (
                      <Col md={6} key={symptom.key} className="mb-3">
                        <Form.Label>
                          <i className={`${symptom.icon} me-2`}></i>
                          {symptom.label}: {newSymptom[symptom.key]}/10
                        </Form.Label>
                        <Form.Range
                          min="0"
                          max="10"
                          value={newSymptom[symptom.key]}
                          onChange={(e) => setNewSymptom({
                            ...newSymptom, 
                            [symptom.key]: parseInt(e.target.value)
                          })}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Ninguno</span>
                          <span>Moderado</span>
                          <span>Severo</span>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Notas adicionales</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newSymptom.notes}
                      onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                      placeholder="Describe cualquier síntoma adicional o contexto relevante..."
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Registrar Síntomas
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Historial de Síntomas</h5>
                <div className="d-flex gap-2">
                  <Form.Select 
                    size="sm" 
                    value={chartPeriod} 
                    onChange={(e) => setChartPeriod(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="7">Últimos 7 días</option>
                    <option value="14">Últimos 14 días</option>
                    <option value="30">Últimos 30 días</option>
                    <option value="90">Últimos 3 meses</option>
                  </Form.Select>
                  <Button 
                    size="sm" 
                    variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('line')}
                  >
                    <i className="bi bi-graph-up"></i>
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('bar')}
                  >
                    <i className="bi bi-bar-chart"></i>
                  </Button>
                </div>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'line' ? (
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        {Object.entries(symptomColors).map(([symptom, color]) => (
                          <Line 
                            key={symptom}
                            type="monotone" 
                            dataKey={symptom} 
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        {Object.entries(symptomColors).map(([symptom, color]) => (
                          <Bar 
                            key={symptom}
                            dataKey={symptom} 
                            fill={color}
                            opacity={0.8}
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h6 className="mb-0">Registros Detallados</h6>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner />
                    </div>
                  ) : symptoms.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
                      <p>No hay síntomas registrados</p>
                    </div>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Dolor</th>
                          <th>Fatiga</th>
                          <th>Náusea</th>
                          <th>Ansiedad</th>
                          <th>Sueño</th>
                          <th>Apetito</th>
                          <th>Notas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {symptoms.slice(0, 20).map(symptom => (
                          <tr key={symptom.id}>
                            <td>{new Date(symptom.date).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.pain_level).color}>
                                {symptom.pain_level}/10
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.fatigue_level).color}>
                                {symptom.fatigue_level}/10
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.nausea_level).color}>
                                {symptom.nausea_level}/10
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.anxiety_level).color}>
                                {symptom.anxiety_level}/10
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.sleep_level).color}>
                                {symptom.sleep_level}/10
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getIntensityLevel(symptom.appetite_level).color}>
                                {symptom.appetite_level}/10
                              </Badge>
                            </td>
                            <td>
                              {symptom.notes ? (
                                <span title={symptom.notes}>
                                  {symptom.notes.length > 30 
                                    ? `${symptom.notes.substring(0, 30)}...` 
                                    : symptom.notes
                                  }
                                </span>
                              ) : (
                                <span className="text-muted">Sin notas</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'share' && (
            <div>
              <Row>
                <Col md={8}>
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Médicos con Acceso</h6>
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Invitar Médico
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {sharedDoctors.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-person-plus fs-1 d-block mb-2"></i>
                          <p>No has compartido tus datos con ningún médico</p>
                        </div>
                      ) : (
                        sharedDoctors.map(doctor => (
                          <div key={doctor.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                            <div>
                              <h6 className="mb-1">{doctor.name}</h6>
                              <p className="text-muted mb-1">{doctor.specialty}</p>
                              <small className="text-muted">{doctor.email}</small>
                              <div className="mt-1">
                                <Badge bg={doctor.status === 'active' ? 'success' : 'warning'}>
                                  {doctor.status === 'active' ? 'Activo' : 'Pendiente'}
                                </Badge>
                                {doctor.permissions.map(perm => (
                                  <Badge key={perm} bg="secondary" className="ms-1">
                                    {perm === 'view' ? 'Ver' : 'Comentar'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => {
                                  setEmailData({...emailData, doctorId: doctor.id});
                                  setShowEmailModal(true);
                                }}
                              >
                                <i className="bi bi-envelope"></i>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Acciones Rápidas</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary"
                          onClick={() => setShowEmailModal(true)}
                        >
                          <i className="bi bi-envelope me-2"></i>
                          Enviar Resumen
                        </Button>
                        <Button variant="outline-secondary">
                          <i className="bi bi-download me-2"></i>
                          Exportar PDF
                        </Button>
                        <Button variant="outline-info">
                          <i className="bi bi-graph-up me-2"></i>
                          Ver Estadísticas
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Modal para enviar email */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Enviar Resumen por Email</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSendEmail}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Médico</Form.Label>
              <Form.Select
                value={emailData.doctorId}
                onChange={(e) => setEmailData({...emailData, doctorId: e.target.value})}
                required
              >
                <option value="">Seleccionar médico...</option>
                {sharedDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Período de datos</Form.Label>
              <Form.Select
                value={emailData.includePeriod}
                onChange={(e) => setEmailData({...emailData, includePeriod: e.target.value})}
              >
                <option value="7">Últimos 7 días</option>
                <option value="14">Últimos 14 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="all">Todos los registros</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Resumen de síntomas - [Período]"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                placeholder="Mensaje adicional para el médico..."
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Incluir gráficas de evolución"
              checked={emailData.includeSymptoms}
              onChange={(e) => setEmailData({...emailData, includeSymptoms: e.target.checked})}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Email'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para invitar médico */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invitar Médico</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInviteDoctor}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email del médico</Form.Label>
              <Form.Control
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                placeholder="doctor@hospital.com"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del médico</Form.Label>
              <Form.Control
                type="text"
                value={inviteData.name}
                onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                placeholder="Dr. Juan Pérez"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Permisos</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Ver datos médicos"
                  checked={inviteData.permissions.includes('view')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setInviteData({
                        ...inviteData, 
                        permissions: [...inviteData.permissions, 'view']
                      });
                    } else {
                      setInviteData({
                        ...inviteData, 
                        permissions: inviteData.permissions.filter(p => p !== 'view')
                      });
                    }
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="Agregar comentarios"
                  checked={inviteData.permissions.includes('comment')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setInviteData({
                        ...inviteData, 
                        permissions: [...inviteData.permissions, 'comment']
                      });
                    } else {
                      setInviteData({
                        ...inviteData, 
                        permissions: inviteData.permissions.filter(p => p !== 'comment')
                      });
                    }
                  }}
                />
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Invitación'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Symptoms;


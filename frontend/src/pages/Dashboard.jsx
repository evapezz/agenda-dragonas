import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, Modal, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
    symptoms: [],
    motivational: [],
    stats: {
      totalAppointments: 0,
      completedAppointments: 0,
      symptomsThisMonth: 0,
      averageWellness: 0,
      reflectionsThisWeek: 0
    }
  });

  // Estados para médicos
  const [patients, setPatients] = useState([]);
  const [medicalStats, setMedicalStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReviews: 0,
    averagePatientWellness: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.role === 'medico') {
        // Dashboard para médicos
        try {
          const [patientsRes, statsRes, appointmentsRes] = await Promise.all([
            api.get('/doctor/patients'),
            api.get('/doctor/stats'),
            api.get('/appointments?role=doctor')
          ]);

          setPatients(patientsRes.data || []);
          setMedicalStats(statsRes.data || {
            totalPatients: 0,
            appointmentsToday: 0,
            pendingReviews: 0,
            averagePatientWellness: 0
          });
          setDashboardData(prev => ({
            ...prev,
            appointments: appointmentsRes.data || []
          }));
        } catch (error) {
          // Datos vacíos para médicos nuevos
          setPatients([]);
          setMedicalStats({
            totalPatients: 0,
            appointmentsToday: 0,
            pendingReviews: 0,
            averagePatientWellness: 0
          });
          setDashboardData(prev => ({
            ...prev,
            appointments: []
          }));
        }
      } else if (user?.role === 'admin') {
        // Dashboard para admin - redirigir a panel de admin
        window.location.href = '/admin';
        return;
      } else {
        // Dashboard para dragonas - SIEMPRE DATOS VACÍOS PARA NUEVOS USUARIOS
        try {
          const [appointmentsRes, symptomsRes, motivationalRes, statsRes] = await Promise.all([
            api.get('/appointments'),
            api.get('/symptoms?limit=5'),
            api.get('/motivational/recent'),
            api.get('/dashboard/stats')
          ]);

          setDashboardData({
            appointments: appointmentsRes.data || [],
            symptoms: symptomsRes.data || [],
            motivational: motivationalRes.data || [],
            stats: statsRes.data || {
              totalAppointments: 0,
              completedAppointments: 0,
              symptomsThisMonth: 0,
              averageWellness: 0,
              reflectionsThisWeek: 0
            }
          });
        } catch (error) {
          // Para nuevos usuarios o errores, mostrar datos completamente vacíos
          setDashboardData({
            appointments: [],
            symptoms: [],
            motivational: [],
            stats: {
              totalAppointments: 0,
              completedAppointments: 0,
              symptomsThisMonth: 0,
              averageWellness: 0,
              reflectionsThisWeek: 0
            }
          });
        }
      }
    } catch (error) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error loading dashboard:', error);
      
      // Datos completamente vacíos en caso de error
      setDashboardData({
        appointments: [],
        symptoms: [],
        motivational: [],
        stats: {
          totalAppointments: 0,
          completedAppointments: 0,
          symptomsThisMonth: 0,
          averageWellness: 0,
          reflectionsThisWeek: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWellnessColor = (level) => {
    if (level >= 8) return 'success';
    if (level >= 6) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando tu dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadDashboardData}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  // Dashboard para médicos
  if (user?.role === 'medico') {
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Panel Médico</h1>
            <p className="text-muted">Bienvenido, Dr. {user.name}</p>
          </div>
          <Button variant="primary" href="/doctor">
            Ver Panel Completo
          </Button>
        </div>

        {/* Estadísticas médicas */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary">{medicalStats.totalPatients}</h3>
                <p className="text-muted mb-0">Pacientes Totales</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{medicalStats.appointmentsToday}</h3>
                <p className="text-muted mb-0">Citas Hoy</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">{medicalStats.pendingReviews}</h3>
                <p className="text-muted mb-0">Revisiones Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">{medicalStats.averagePatientWellness.toFixed(1)}</h3>
                <p className="text-muted mb-0">Bienestar Promedio</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Lista de pacientes recientes */}
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Pacientes Recientes</h5>
              </Card.Header>
              <Card.Body>
                {patients.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No tienes pacientes asignados aún.</p>
                    <Button variant="outline-primary" href="/doctor">
                      Gestionar Pacientes
                    </Button>
                  </div>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Último Registro</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.slice(0, 5).map(patient => (
                        <tr key={patient.id}>
                          <td>{patient.name} {patient.last_name}</td>
                          <td>{patient.last_symptom_date ? formatDate(patient.last_symptom_date) : 'Sin registros'}</td>
                          <td>
                            <Badge bg={getWellnessColor(patient.wellness_level || 0)}>
                              {patient.wellness_level ? `${patient.wellness_level}/10` : 'Sin datos'}
                            </Badge>
                          </td>
                          <td>
                            <Button size="sm" variant="outline-primary" href={`/doctor/patient/${patient.id}`}>
                              Ver Detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Citas de Hoy</h5>
              </Card.Header>
              <Card.Body>
                {dashboardData.appointments.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted">No tienes citas programadas para hoy.</p>
                  </div>
                ) : (
                  dashboardData.appointments.slice(0, 3).map(appointment => (
                    <div key={appointment.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                      <div>
                        <strong>{appointment.patient_name}</strong>
                        <br />
                        <small className="text-muted">{appointment.time}</small>
                      </div>
                      <Badge bg="primary">{appointment.type}</Badge>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Dashboard para dragonas
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Mi Dashboard</h1>
          <p className="text-muted">Bienvenida, {user.name}</p>
        </div>
        <div>
          <Button variant="primary" href="/sintomas" className="me-2">
            Registrar Síntomas
          </Button>
          <Button variant="outline-primary" href="/motivacion">
            Centro de Motivación
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{dashboardData.stats.totalAppointments}</h3>
              <p className="text-muted mb-0">Citas Totales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{dashboardData.stats.completedAppointments}</h3>
              <p className="text-muted mb-0">Citas Completadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{dashboardData.stats.symptomsThisMonth}</h3>
              <p className="text-muted mb-0">Síntomas Este Mes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{dashboardData.stats.averageWellness.toFixed(1)}</h3>
              <p className="text-muted mb-0">Bienestar Promedio</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Próximas citas */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Próximas Citas</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.appointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No tienes citas programadas.</p>
                  <Button variant="outline-primary" href="/citas">
                    Programar Cita
                  </Button>
                </div>
              ) : (
                dashboardData.appointments.slice(0, 3).map(appointment => (
                  <div key={appointment.id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                    <div>
                      <strong>{appointment.title}</strong>
                      <br />
                      <small className="text-muted">
                        {formatDate(appointment.date)} - {appointment.time}
                      </small>
                      <br />
                      <small className="text-muted">Dr. {appointment.doctor_name}</small>
                    </div>
                    <Badge bg="primary">{appointment.type}</Badge>
                  </div>
                ))
              )}
              {dashboardData.appointments.length > 3 && (
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" href="/citas">
                    Ver Todas las Citas
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Síntomas recientes */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Síntomas Recientes</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.symptoms.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No has registrado síntomas aún.</p>
                  <Button variant="outline-primary" href="/sintomas">
                    Registrar Síntomas
                  </Button>
                </div>
              ) : (
                dashboardData.symptoms.map(symptom => (
                  <div key={symptom.id} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{formatDate(symptom.date)}</strong>
                      <Badge bg={getWellnessColor(symptom.overall_wellness || 0)}>
                        Bienestar: {symptom.overall_wellness || 0}/10
                      </Badge>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Dolor: {symptom.pain_level || 0}/10</small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Fatiga: {symptom.fatigue_level || 0}/10</small>
                      </div>
                    </div>
                    {symptom.notes && (
                      <small className="text-muted d-block mt-1">
                        {symptom.notes.substring(0, 50)}...
                      </small>
                    )}
                  </div>
                ))
              )}
              {dashboardData.symptoms.length > 0 && (
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" href="/sintomas">
                    Ver Historial Completo
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reflexiones motivacionales */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Centro de Motivación</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.motivational.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No has creado reflexiones aún.</p>
                  <Button variant="outline-primary" href="/motivacion">
                    Crear Primera Reflexión
                  </Button>
                </div>
              ) : (
                <Row>
                  {dashboardData.motivational.slice(0, 3).map(reflection => (
                    <Col md={4} key={reflection.id}>
                      <div className="p-3 border rounded mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{formatDate(reflection.date)}</strong>
                          <Badge bg="info">Ánimo: {reflection.mood || 0}/10</Badge>
                        </div>
                        {reflection.gratitude && (
                          <p className="text-muted mb-1">
                            <strong>Gratitud:</strong> {reflection.gratitude.substring(0, 50)}...
                          </p>
                        )}
                        {reflection.achievement && (
                          <p className="text-muted mb-0">
                            <strong>Logro:</strong> {reflection.achievement.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              {dashboardData.motivational.length > 3 && (
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" href="/motivacion">
                    Ver Todas las Reflexiones
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;


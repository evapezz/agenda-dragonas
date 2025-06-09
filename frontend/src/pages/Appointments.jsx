// frontend/src/pages/Appointments.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import api from '../services/api';

const Appointments = () => {
  // Estado para lista de citas
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Estados para el formulario de nueva cita
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar todas las citas al montar
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setErrorMsg('No se pudo cargar las citas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Función para crear nueva cita
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !date || !location) {
      setFormError('Título, fecha y ubicación son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        date,
        location,
        appointmentType: 'medica',
        reminder: false,
        reminderTime: null
      };
      const res = await api.post('/appointments', payload);
      // Insertar al inicio de la lista y limpiar formulario
      setAppointments((prev) => [res.data, ...prev]);
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
    } catch (err) {
      console.error(err);
      setFormError('Error creando la cita.');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para eliminar una cita
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta cita?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la cita.');
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Agenda de Citas</h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h2 className="h4 mb-3">Crear Nueva Cita</h2>
              {formError && <Alert variant="danger">{formError}</Alert>}
              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Título de la cita"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Detalles de la cita (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Fecha y Hora</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLocation">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Lugar de la cita"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cita'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h2 className="h4 mb-3">Mis Citas</h2>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : errorMsg ? (
                <Alert variant="danger">{errorMsg}</Alert>
              ) : appointments.length === 0 ? (
                <Alert variant="info">No tienes citas programadas.</Alert>
              ) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Título</th>
                      <th>Ubicación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          {new Date(appt.date).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>{appt.title}</td>
                        <td>{appt.location}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(appt.id)}
                          >
                            Eliminar
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
      </Row>
    </Container>
  );
};

export default Appointments;

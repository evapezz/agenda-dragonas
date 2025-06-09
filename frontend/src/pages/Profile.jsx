// frontend/src/pages/Profile.jsx - Versión completa con foto de perfil y diferenciación por roles

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, Spinner, ListGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import AskDoctor from '../components/AskDoctor';

const Profile = () => {
  const { user, updateUserProfile, loading } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    emergencyContact: '',
    medicalNotes: '',
    specialty: '',
    licenseNumber: '',
    hospital: '',
    bio: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Estados específicos para médicos
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      lastVisit: '2025-06-01',
      status: 'active',
      nextAppointment: '2025-06-15'
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria.lopez@email.com',
      lastVisit: '2025-05-28',
      status: 'active',
      nextAppointment: '2025-06-10'
    },
    {
      id: 3,
      name: 'Carmen Ruiz',
      email: 'carmen.ruiz@email.com',
      lastVisit: '2025-05-25',
      status: 'pending',
      nextAppointment: null
    }
  ]);

  // Estado para el médico asignado (solo para dragonas)
  const [assignedDoctor, setAssignedDoctor] = useState({
    id: 1,
    name: 'Dra. María Rodríguez',
    specialty: 'Oncología',
    hospital: 'Hospital Universitario',
    image: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthdate: user.birthdate || '',
        emergencyContact: user.emergencyContact || '',
        medicalNotes: user.medicalNotes || '',
        specialty: user.specialty || '',
        licenseNumber: user.licenseNumber || '',
        hospital: user.hospital || '',
        bio: user.bio || ''
      });
      
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La imagen no puede ser mayor a 5MB');
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;
    
    setUpdating(true);
    try {
      // Simular subida de imagen
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setShowImageModal(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al subir la imagen');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el perfil. Inténtalo de nuevo más tarde.');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const renderDragonaProfile = () => (
    <>
      {activeTab === 'profile' && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="mb-4">Información personal</h4>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">¡Perfil actualizado con éxito!</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      disabled
                    />
                    <Form.Text className="text-muted">
                      El correo electrónico no se puede cambiar.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Tu número de teléfono"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Contacto de emergencia</Form.Label>
                <Form.Control
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Nombre y teléfono de contacto de emergencia"
                />
              </Form.Group>
              
              <div className="text-end">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={updating}
                >
                  {updating ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {activeTab === 'medical' && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="mb-4">Información médica</h4>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Notas médicas importantes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  placeholder="Alergias, medicamentos actuales, condiciones previas, etc."
                />
                <Form.Text className="text-muted">
                  Esta información será compartida con tu médico asignado.
                </Form.Text>
              </Form.Group>
              
              <h5 className="mb-3">Médico asignado</h5>
              <Card className="border-0 bg-light mb-4">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        {getInitials(assignedDoctor.name)}
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">{assignedDoctor.name}</h6>
                      <p className="text-muted mb-0 small">
                        {assignedDoctor.specialty} - {assignedDoctor.hospital}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="text-end">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={updating}
                >
                  {updating ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {activeTab === 'ask-doctor' && (
        <AskDoctor doctorId={assignedDoctor.id} />
      )}
    </>
  );

  const renderDoctorProfile = () => (
    <>
      {activeTab === 'profile' && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="mb-4">Información profesional</h4>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">¡Perfil actualizado con éxito!</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr./Dra. Nombre completo"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@hospital.com"
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="Ej: Oncología, Medicina Interna"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de colegiado</Form.Label>
                    <Form.Control
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="Número de colegiado"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hospital/Clínica</Form.Label>
                    <Form.Control
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      placeholder="Centro médico donde trabajas"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Teléfono de contacto"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Biografía profesional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Describe tu experiencia, formación y enfoque profesional..."
                />
              </Form.Group>
              
              <div className="text-end">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={updating}
                >
                  {updating ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {activeTab === 'patients' && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Mis pacientes</h4>
              <Badge bg="primary" pill>{patients.length} pacientes</Badge>
            </div>
            
            <ListGroup variant="flush">
              {patients.map((patient) => (
                <ListGroup.Item key={patient.id} className="d-flex justify-content-between align-items-center px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {getInitials(patient.name)}
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">{patient.name}</h6>
                      <p className="text-muted small mb-0">{patient.email}</p>
                      <p className="text-muted small mb-0">
                        Última visita: {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <Badge bg={patient.status === 'active' ? 'success' : 'warning'} className="mb-1">
                      {patient.status === 'active' ? 'Activo' : 'Pendiente'}
                    </Badge>
                    {patient.nextAppointment && (
                      <p className="text-muted small mb-0">
                        Próxima cita: {new Date(patient.nextAppointment).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </>
  );

  const getNavItems = () => {
    if (user?.role === 'medico') {
      return [
        { key: 'profile', icon: 'bi-person', label: 'Información profesional' },
        { key: 'patients', icon: 'bi-people', label: 'Mis pacientes' },
        { key: 'settings', icon: 'bi-gear', label: 'Configuración' }
      ];
    } else {
      return [
        { key: 'profile', icon: 'bi-person', label: 'Información personal' },
        { key: 'medical', icon: 'bi-clipboard2-pulse', label: 'Información médica' },
        { key: 'ask-doctor', icon: 'bi-chat-dots', label: 'Consultar al médico' },
        { key: 'settings', icon: 'bi-gear', label: 'Configuración' }
      ];
    }
  };

  return (
    <Container className="py-4 animate-fade-in">
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h1 className="section-title mb-2">Mi Perfil</h1>
              <p className="text-muted">
                {user?.role === 'medico' 
                  ? 'Gestiona tu información profesional y pacientes.' 
                  : 'Gestiona tu información personal y preferencias de la aplicación.'
                }
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={3} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 position-relative"
                    style={{ width: '80px', height: '80px', fontSize: '24px', cursor: 'pointer' }}
                    onClick={() => setShowImageModal(true)}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Perfil" 
                        className="rounded-circle w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      getInitials(user?.name || 'Usuario')
                    )}
                    <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm">
                      <i className="bi bi-camera text-primary" style={{ fontSize: '12px' }}></i>
                    </div>
                  </div>
                </div>
                <h5 className="mb-1">{user?.name || 'Usuario'}</h5>
                <p className="text-muted small mb-0">{user?.email || 'usuario@ejemplo.com'}</p>
                {user?.role === 'medico' && (
                  <Badge bg="success" className="mt-2">Médico</Badge>
                )}
              </div>
              
              <div className="profile-nav">
                {getNavItems().map((item) => (
                  <div 
                    key={item.key}
                    className={`profile-nav-item ${activeTab === item.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <i className={`${item.icon} me-2`}></i> {item.label}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={9}>
          {user?.role === 'medico' ? renderDoctorProfile() : renderDragonaProfile()}
          
          {activeTab === 'settings' && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4">Configuración</h4>
                
                <h5 className="mb-3">Notificaciones</h5>
                <Form.Check 
                  type="switch"
                  id="notification-email"
                  label="Recibir notificaciones por correo electrónico"
                  defaultChecked={false}
                  className="mb-2"
                />
                <Form.Check 
                  type="switch"
                  id="notification-app"
                  label="Recibir notificaciones en la aplicación"
                  defaultChecked={false}
                  className="mb-2"
                />
                <Form.Check 
                  type="switch"
                  id="notification-reminder"
                  label="Recordatorios de citas"
                  defaultChecked={false}
                  className="mb-4"
                />
                
                <h5 className="mb-3">Privacidad</h5>
                {user?.role === 'dragona' ? (
                  <>
                    <Form.Check 
                      type="switch"
                      id="privacy-share-doctor"
                      label="Compartir información con mi médico"
                      defaultChecked={false}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="switch"
                      id="privacy-anonymous"
                      label="Participar anónimamente en estadísticas de investigación"
                      defaultChecked={false}
                      className="mb-4"
                    />
                  </>
                ) : (
                  <>
                    <Form.Check 
                      type="switch"
                      id="privacy-patient-data"
                      label="Acceso a datos de pacientes"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check 
                      type="switch"
                      id="privacy-research"
                      label="Participar en investigación médica"
                      defaultChecked={false}
                      className="mb-4"
                    />
                  </>
                )}
                
                <div className="text-end">
                  <Button variant="outline-danger" className="me-2">
                    Cerrar sesión
                  </Button>
                  <Button variant="primary">
                    Guardar preferencias
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal para cambiar foto de perfil */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar foto de perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div 
              className="rounded-circle bg-light border d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '120px', height: '120px' }}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Vista previa" 
                  className="rounded-circle w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <i className="bi bi-person" style={{ fontSize: '48px', color: '#ccc' }}></i>
              )}
            </div>
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <Form.Text className="text-muted">
              Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleImageUpload}
            disabled={!profileImage || updating}
          >
            {updating ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Subiendo...
              </>
            ) : (
              'Guardar foto'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;


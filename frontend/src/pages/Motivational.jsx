import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Alert, Nav, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Motivational = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para reflexión diaria
  const [todayReflection, setTodayReflection] = useState(null);
  const [reflectionForm, setReflectionForm] = useState({
    mood: 5,
    energy: 5,
    gratitude: '',
    achievement: '',
    notes: '',
    stickers: []
  });

  // Estados para historial
  const [reflections, setReflections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gratitudes, setGratitudes] = useState([]);

  // Estados para stickers
  const [availableStickers, setAvailableStickers] = useState([
    { id: 1, emoji: '😊', name: 'Feliz' },
    { id: 2, emoji: '💪', name: 'Fuerte' },
    { id: 3, emoji: '🌟', name: 'Brillante' },
    { id: 4, emoji: '❤️', name: 'Amor' },
    { id: 5, emoji: '🌈', name: 'Esperanza' },
    { id: 6, emoji: '🦋', name: 'Transformación' },
    { id: 7, emoji: '🌸', name: 'Delicada' },
    { id: 8, emoji: '🔥', name: 'Energía' },
    { id: 9, emoji: '🌙', name: 'Tranquila' },
    { id: 10, emoji: '☀️', name: 'Radiante' },
    { id: 11, emoji: '🎯', name: 'Enfocada' },
    { id: 12, emoji: '🏆', name: 'Victoriosa' }
  ]);

  // Frases motivacionales aleatorias
  const [motivationalQuotes] = useState([
    "Eres más fuerte de lo que crees y más valiente de lo que sientes.",
    "Cada día es una nueva oportunidad para brillar.",
    "Tu fortaleza interior es tu mayor superpoder.",
    "Pequeños pasos cada día llevan a grandes cambios.",
    "Eres la autora de tu propia historia de superación.",
    "La esperanza es el combustible del alma.",
    "Tu valentía inspira a otras mujeres.",
    "Cada cicatriz cuenta una historia de supervivencia.",
    "Eres un ejemplo de resistencia y gracia.",
    "Tu luz interior nunca se apaga.",
    "Mereces todo el amor y cuidado del mundo.",
    "Eres más resiliente de lo que imaginas.",
    "Tu bienestar es una prioridad, no un lujo.",
    "Cada día que luchas es una victoria.",
    "Eres una guerrera disfrazada de mujer.",
    "Tu fuerza interior mueve montañas.",
    "Eres digna de todos tus sueños.",
    "La sanación comienza con el amor propio.",
    "Eres un milagro caminando por este mundo.",
    "Tu presencia hace la diferencia."
  ]);

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  // Preguntas rotativas para gratitud y logros
  const gratitudeQuestions = [
    "¿Por qué estás agradecida hoy?",
    "¿Qué momento te llenó de paz hoy?",
    "¿Qué persona te hizo sonreír?",
    "¿Qué pequeño detalle te alegró el día?",
    "¿Qué parte de tu cuerpo agradeces hoy?",
    "¿Qué experiencia te enseñó algo nuevo?",
    "¿Qué acto de bondad recibiste o diste?"
  ];

  const achievementQuestions = [
    "¿Qué lograste hoy, por pequeño que sea?",
    "¿En qué momento te sentiste orgullosa?",
    "¿Qué desafío superaste hoy?",
    "¿Qué nueva habilidad desarrollaste?",
    "¿Cómo cuidaste de ti misma hoy?",
    "¿Qué paso diste hacia tus metas?",
    "¿Qué acto de valentía realizaste?"
  ];

  const [currentGratitudeQuestion, setCurrentGratitudeQuestion] = useState(gratitudeQuestions[0]);
  const [currentAchievementQuestion, setCurrentAchievementQuestion] = useState(achievementQuestions[0]);

  useEffect(() => {
    loadTodayReflection();
    loadReflectionHistory();
    shuffleQuestions();
  }, []);

  const loadTodayReflection = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/motivational/reflection/${today}`);
      setTodayReflection(response.data);
      if (response.data) {
        setReflectionForm(response.data);
      }
    } catch (error) {
      // No hay reflexión para hoy, está bien
    }
  };

  const loadReflectionHistory = async () => {
    try {
      setLoading(true);
      const [reflectionsRes, achievementsRes, gratitudesRes] = await Promise.all([
        api.get('/motivational/reflections'),
        api.get('/motivational/achievements'),
        api.get('/motivational/gratitudes')
      ]);
      
      setReflections(reflectionsRes.data);
      setAchievements(achievementsRes.data);
      setGratitudes(gratitudesRes.data);
    } catch (error) {
      setError('Error al cargar el historial');
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleQuestions = () => {
    const randomGratitude = gratitudeQuestions[Math.floor(Math.random() * gratitudeQuestions.length)];
    const randomAchievement = achievementQuestions[Math.floor(Math.random() * achievementQuestions.length)];
    setCurrentGratitudeQuestion(randomGratitude);
    setCurrentAchievementQuestion(randomAchievement);
  };

  const shuffleQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  const handleSaveReflection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const reflectionData = {
        ...reflectionForm,
        date: new Date().toISOString().split('T')[0]
      };

      if (todayReflection) {
        await api.put(`/motivational/reflection/${todayReflection.id}`, reflectionData);
        setSuccess('Reflexión actualizada correctamente');
      } else {
        await api.post('/motivational/reflection', reflectionData);
        setSuccess('Reflexión guardada correctamente');
      }

      await loadTodayReflection();
      await loadReflectionHistory();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error al guardar la reflexión');
      console.error('Error saving reflection:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStickerToReflection = (sticker) => {
    if (!reflectionForm.stickers.find(s => s.id === sticker.id)) {
      setReflectionForm({
        ...reflectionForm,
        stickers: [...reflectionForm.stickers, sticker]
      });
    }
  };

  const removeStickerFromReflection = (stickerId) => {
    setReflectionForm({
      ...reflectionForm,
      stickers: reflectionForm.stickers.filter(s => s.id !== stickerId)
    });
  };

  const getMoodColor = (mood) => {
    if (mood <= 3) return 'danger';
    if (mood <= 6) return 'warning';
    return 'success';
  };

  const getMoodEmoji = (mood) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😐';
    if (mood <= 6) return '🙂';
    if (mood <= 8) return '😊';
    return '😄';
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <img 
              src="/images/1.jpg" 
              alt="Apoyo y Comunidad" 
              className="rounded-circle me-3"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
            <div>
              <h2 className="mb-1">Centro de Motivación</h2>
              <p className="text-muted mb-0">Tu espacio de reflexión y crecimiento personal</p>
            </div>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

          {/* Frase motivacional */}
          <Card className="mb-4 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white text-center py-4">
              <h5 className="mb-3">💫 Frase del Día</h5>
              <p className="lead mb-3">"{currentQuote}"</p>
              <Button 
                variant="light" 
                size="sm"
                onClick={shuffleQuote}
              >
                <i className="bi bi-shuffle me-2"></i>
                Nueva Frase
              </Button>
            </Card.Body>
          </Card>

          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'today'} 
                onClick={() => setActiveTab('today')}
              >
                <i className="bi bi-sun me-2"></i>Reflexión de Hoy
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
              >
                <i className="bi bi-journal-text me-2"></i>Mi Historial
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'today' && (
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-heart me-2"></i>
                      Reflexión Diaria - {new Date().toLocaleDateString()}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSaveReflection}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Estado de ánimo: {getMoodEmoji(reflectionForm.mood)} ({reflectionForm.mood}/10)
                            </Form.Label>
                            <Form.Range
                              min="1"
                              max="10"
                              value={reflectionForm.mood}
                              onChange={(e) => setReflectionForm({
                                ...reflectionForm, 
                                mood: parseInt(e.target.value)
                              })}
                            />
                            <div className="d-flex justify-content-between small text-muted">
                              <span>Muy bajo</span>
                              <span>Excelente</span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Nivel de energía: ⚡ ({reflectionForm.energy}/10)
                            </Form.Label>
                            <Form.Range
                              min="1"
                              max="10"
                              value={reflectionForm.energy}
                              onChange={(e) => setReflectionForm({
                                ...reflectionForm, 
                                energy: parseInt(e.target.value)
                              })}
                            />
                            <div className="d-flex justify-content-between small text-muted">
                              <span>Sin energía</span>
                              <span>Llena de energía</span>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-heart-fill text-danger me-2"></i>
                          {currentGratitudeQuestion}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reflectionForm.gratitude}
                          onChange={(e) => setReflectionForm({
                            ...reflectionForm, 
                            gratitude: e.target.value
                          })}
                          placeholder="Escribe aquí tu gratitud del día..."
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-trophy-fill text-warning me-2"></i>
                          {currentAchievementQuestion}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reflectionForm.achievement}
                          onChange={(e) => setReflectionForm({
                            ...reflectionForm, 
                            achievement: e.target.value
                          })}
                          placeholder="Describe tu logro del día..."
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-pencil-fill text-primary me-2"></i>
                          Notas adicionales
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reflectionForm.notes}
                          onChange={(e) => setReflectionForm({
                            ...reflectionForm, 
                            notes: e.target.value
                          })}
                          placeholder="Cualquier pensamiento o reflexión adicional..."
                        />
                      </Form.Group>

                      {/* Stickers integrados en la reflexión */}
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <i className="bi bi-emoji-smile me-2"></i>
                          Decora tu reflexión con stickers
                        </Form.Label>
                        
                        {/* Stickers seleccionados */}
                        {reflectionForm.stickers.length > 0 && (
                          <div className="mb-3 p-3 border rounded bg-light">
                            <small className="text-muted d-block mb-2">Stickers en tu reflexión:</small>
                            <div className="d-flex flex-wrap gap-2">
                              {reflectionForm.stickers.map(sticker => (
                                <Badge 
                                  key={sticker.id}
                                  bg="primary" 
                                  className="p-2 cursor-pointer"
                                  onClick={() => removeStickerFromReflection(sticker.id)}
                                  title={`${sticker.emoji} ${sticker.name} - Click para quitar`}
                                >
                                  {sticker.emoji} {sticker.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stickers disponibles */}
                        <div className="d-flex flex-wrap gap-2">
                          {availableStickers.map(sticker => (
                            <Button
                              key={sticker.id}
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => addStickerToReflection(sticker)}
                              disabled={reflectionForm.stickers.find(s => s.id === sticker.id)}
                              title={sticker.name}
                            >
                              {sticker.emoji}
                            </Button>
                          ))}
                        </div>
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={loading}
                          className="flex-grow-1"
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              {todayReflection ? 'Actualizar Reflexión' : 'Guardar Reflexión'}
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline-secondary"
                          onClick={shuffleQuestions}
                        >
                          <i className="bi bi-shuffle"></i>
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Tu Estado Actual</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <div className="display-1 mb-2">
                        {getMoodEmoji(reflectionForm.mood)}
                      </div>
                      <Badge bg={getMoodColor(reflectionForm.mood)} className="mb-2">
                        Ánimo: {reflectionForm.mood}/10
                      </Badge>
                      <br />
                      <Badge bg="info">
                        Energía: {reflectionForm.energy}/10
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Progreso Semanal</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <p className="text-muted mb-2">Reflexiones completadas</p>
                      <div className="display-4 text-primary">
                        {reflections.filter(r => {
                          const reflectionDate = new Date(r.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return reflectionDate >= weekAgo;
                        }).length}/7
                      </div>
                      <small className="text-muted">esta semana</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'history' && (
            <Row>
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Mis Reflexiones</h6>
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <div className="text-center py-4">
                        <Spinner />
                      </div>
                    ) : reflections.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
                        <p>Aún no tienes reflexiones guardadas</p>
                      </div>
                    ) : (
                      reflections.slice(0, 10).map(reflection => (
                        <div key={reflection.id} className="border-bottom py-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-1">
                              {new Date(reflection.date).toLocaleDateString()}
                            </h6>
                            <div>
                              <Badge bg={getMoodColor(reflection.mood)}>
                                {getMoodEmoji(reflection.mood)} {reflection.mood}/10
                              </Badge>
                            </div>
                          </div>
                          
                          {reflection.gratitude && (
                            <div className="mb-2">
                              <small className="text-muted">Gratitud:</small>
                              <p className="mb-1">{reflection.gratitude}</p>
                            </div>
                          )}
                          
                          {reflection.achievement && (
                            <div className="mb-2">
                              <small className="text-muted">Logro:</small>
                              <p className="mb-1">{reflection.achievement}</p>
                            </div>
                          )}

                          {reflection.stickers && reflection.stickers.length > 0 && (
                            <div className="d-flex gap-1">
                              {reflection.stickers.map(sticker => (
                                <span key={sticker.id} title={sticker.name}>
                                  {sticker.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Estadísticas</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="h4 text-primary">{reflections.length}</div>
                        <small className="text-muted">Reflexiones</small>
                      </div>
                      <div className="col-6">
                        <div className="h4 text-success">
                          {reflections.length > 0 
                            ? Math.round(reflections.reduce((sum, r) => sum + r.mood, 0) / reflections.length)
                            : 0
                          }
                        </div>
                        <small className="text-muted">Ánimo promedio</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Mis Logros Recientes</h6>
                  </Card.Header>
                  <Card.Body>
                    {achievements.slice(0, 5).map((achievement, index) => (
                      <div key={index} className="d-flex align-items-start mb-2">
                        <i className="bi bi-trophy-fill text-warning me-2 mt-1"></i>
                        <small>{achievement.text}</small>
                      </div>
                    ))}
                    {achievements.length === 0 && (
                      <small className="text-muted">Aún no hay logros registrados</small>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Motivational;


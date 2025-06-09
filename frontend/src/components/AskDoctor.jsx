// frontend/src/components/AskDoctor.jsx

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AskDoctor = ({ doctorId }) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Cargar preguntas anteriores
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo para la demostración
        const mockQuestions = [
          {
            id: 1,
            question: "¿Es normal sentir dolor de cabeza después de la quimioterapia?",
            createdAt: "2025-06-01T14:30:00Z",
            isAnswered: true,
            answer: "Sí, es un efecto secundario común. Si persiste o es muy intenso, podemos ajustar la medicación para aliviarlo.",
            answeredAt: "2025-06-02T09:15:00Z"
          },
          {
            id: 2,
            question: "¿Puedo hacer ejercicio moderado durante el tratamiento?",
            createdAt: "2025-05-29T10:15:00Z",
            isAnswered: false,
            answer: null,
            answeredAt: null
          }
        ];
        
        setQuestions(mockQuestions);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus preguntas anteriores. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [doctorId]);

  // Enviar nueva pregunta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setSending(true);
    setError('');
    setSuccess(false);
    
    try {
      // Simulación de envío de pregunta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí iría la llamada a la API
      // await api.post('/doctor-questions', { doctorId, question });
      
      // Añadir la nueva pregunta a la lista
      const newQuestion = {
        id: Date.now(),
        question,
        createdAt: new Date().toISOString(),
        isAnswered: false,
        answer: null,
        answeredAt: null
      };
      
      setQuestions([newQuestion, ...questions]);
      setQuestion('');
      setSuccess(true);
      
      // Limpiar el mensaje de éxito después de unos segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar tu pregunta. Por favor, intenta de nuevo más tarde.');
    } finally {
      setSending(false);
    }
  };
  
  // Ver detalles de una pregunta
  const handleViewQuestion = (q) => {
    setSelectedQuestion(q);
    setShowModal(true);
  };
  
  // Formatear fecha relativa
  const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes === 0 ? 'Justo ahora' : `Hace ${diffMinutes} minutos`;
      }
      return `Hace ${diffHours} horas`;
    }
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="ask-doctor-component">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="card-title mb-3">Pregunta a tu médico</h5>
          <p className="text-muted mb-4">
            Envía tus dudas directamente a tu médico asignado. Recibirás una notificación cuando responda a tu consulta.
          </p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">¡Tu pregunta ha sido enviada con éxito!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tu pregunta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribe aquí tu duda o consulta médica..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={sending}
              />
            </Form.Group>
            <div className="text-end">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={sending || !question.trim()}
              >
                {sending ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Enviar pregunta
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <h5 className="mb-3">Historial de preguntas</h5>
      
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Cargando tus preguntas...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-chat-left-text" style={{ fontSize: '2rem', color: '#ccc' }}></i>
          <p className="text-muted mt-2">Aún no has realizado ninguna pregunta.</p>
        </div>
      ) : (
        <div className="questions-history">
          {questions.map((q) => (
            <Card 
              key={q.id} 
              className={`mb-3 border-0 shadow-sm question-card ${!q.isAnswered ? 'unanswered' : ''}`}
              onClick={() => handleViewQuestion(q)}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{q.question}</h6>
                  {q.isAnswered ? (
                    <Badge bg="success" pill>Respondida</Badge>
                  ) : (
                    <Badge bg="warning" pill>Pendiente</Badge>
                  )}
                </div>
                <p className="text-muted small mb-0">
                  <i className="bi bi-clock me-1"></i> {formatRelativeDate(q.createdAt)}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal para ver detalles de la pregunta */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestion && (
            <div className="question-details">
              <div className="question-container mb-3">
                <h6>Tu pregunta:</h6>
                <div className="p-3 bg-light rounded">
                  <p className="mb-1">{selectedQuestion.question}</p>
                  <small className="text-muted">
                    {formatRelativeDate(selectedQuestion.createdAt)}
                  </small>
                </div>
              </div>
              
              {selectedQuestion.isAnswered ? (
                <div className="answer-container">
                  <h6>Respuesta del médico:</h6>
                  <div className="p-3 bg-light rounded border-left-primary">
                    <p className="mb-1">{selectedQuestion.answer}</p>
                    <small className="text-muted">
                      {formatRelativeDate(selectedQuestion.answeredAt)}
                    </small>
                  </div>
                </div>
              ) : (
                <Alert variant="warning">
                  <i className="bi bi-clock me-2"></i>
                  Tu pregunta aún no ha sido respondida. Recibirás una notificación cuando el médico responda.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AskDoctor;

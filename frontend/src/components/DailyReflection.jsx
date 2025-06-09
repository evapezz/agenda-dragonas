// frontend/src/components/DailyReflection.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Modal, Badge } from 'react-bootstrap';
import Draggable from 'react-draggable';

const DailyReflection = () => {
  const [reflection, setReflection] = useState('');
  const [savedReflections, setSavedReflections] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('motivacional');
  const [placedStickers, setPlacedStickers] = useState([]);
  const [reflectionBackground, setReflectionBackground] = useState('bg-light');
  const [reflectionStyle, setReflectionStyle] = useState('default');
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  
  const reflectionCardRef = useRef(null);

  // Categorías de stickers
  const categories = [
    { id: 'motivacional', name: 'Motivacionales' },
    { id: 'emocional', name: 'Emocionales' },
    { id: 'medica', name: 'Médicas' },
    { id: 'estacional', name: 'Estacionales' },
    { id: 'personalizada', name: 'Personalizadas' }
  ];

  // Estilos disponibles para la tarjeta de reflexión
  const cardStyles = [
    { id: 'default', name: 'Clásico', class: 'border-0' },
    { id: 'rounded', name: 'Redondeado', class: 'border-0 rounded-4' },
    { id: 'quote', name: 'Cita', class: 'border-0 border-start border-5 border-primary ps-3' },
    { id: 'shadow', name: 'Sombra', class: 'border-0 shadow-lg' }
  ];

  // Fondos disponibles para la tarjeta de reflexión
  const cardBackgrounds = [
    { id: 'bg-light', name: 'Claro', textClass: 'text-dark' },
    { id: 'bg-primary bg-opacity-10', name: 'Azul suave', textClass: 'text-dark' },
    { id: 'bg-info bg-opacity-10', name: 'Celeste', textClass: 'text-dark' },
    { id: 'bg-success bg-opacity-10', name: 'Verde suave', textClass: 'text-dark' },
    { id: 'bg-warning bg-opacity-10', name: 'Amarillo suave', textClass: 'text-dark' },
    { id: 'bg-danger bg-opacity-10', name: 'Rosa suave', textClass: 'text-dark' },
    { id: 'bg-primary', name: 'Azul', textClass: 'text-white' },
    { id: 'bg-dark', name: 'Oscuro', textClass: 'text-white' }
  ];

 
  const stickers = [
    { id: 1, name: 'Dragón Sonriente', category: 'motivacional', image: '/assets/stickers/motivacional/dragon_smile.png' },
    { id: 2, name: 'Dragón Luchador', category: 'motivacional', image: '/assets/stickers/motivacional/dragon_fighter.png' },
    { id: 3, name: 'Corazón', category: 'emocional', image: '/assets/stickers/emocional/heart.png' },
    { id: 4, name: 'Estrella', category: 'estacional', image: '/assets/stickers/estacional/star.png' }
  ];

  // Reflexiones predefinidas para inspiración
  const predefinedReflections = [
    "Hoy me siento agradecida por el apoyo de mi familia y amigos.",
    "Cada día es una nueva oportunidad para cuidar mi bienestar.",
    "Mi fortaleza interior crece con cada desafío que supero.",
    "Me permito sentir mis emociones y aprender de ellas.",
    "Hoy elijo enfocarme en lo positivo y en lo que puedo controlar."
  ];

  // Filtrar stickers por categoría seleccionada
  const filteredStickers = stickers.filter(sticker => sticker.category === selectedCategory);

  // Cargar reflexiones guardadas al iniciar
  useEffect(() => {
    // En una aplicación real, esto vendría de una API o localStorage
    const mockSavedReflections = [
      {
        id: 1,
        date: '2025-06-01',
        text: 'Hoy me siento más fuerte que ayer. Cada pequeño paso cuenta en este camino.',
        background: 'bg-primary bg-opacity-10',
        style: 'quote',
        stickers: [
          { id: 101, stickerId: 2, image: '/assets/stickers/motivacional/dragon_fighter.png', position: { x: 20, y: 20 } },
          { id: 102, stickerId: 4, image: '/assets/stickers/estacional/star.png', position: { x: 200, y: 50 } }
        ]
      },
      {
        id: 2,
        date: '2025-05-28',
        text: 'Agradecida por el apoyo de mi familia y el equipo médico. No estoy sola en esto.',
        background: 'bg-danger bg-opacity-10',
        style: 'default',
        stickers: [
          { id: 103, stickerId: 3, image: '/assets/stickers/emocional/heart.png', position: { x: 150, y: 30 } }
        ]
      }
    ];
    
    setSavedReflections(mockSavedReflections);
  }, []);

  // Añadir una pegatina al canvas de reflexión
  const addSticker = (sticker) => {
    const newSticker = {
      id: Date.now(),
      stickerId: sticker.id,
      image: sticker.image,
      position: { 
        x: Math.random() * (reflectionCardRef.current?.offsetWidth - 80) || 50, 
        y: Math.random() * (reflectionCardRef.current?.offsetHeight - 80) || 50 
      }
    };
    setPlacedStickers([...placedStickers, newSticker]);
  };

  // Eliminar una pegatina del canvas
  const removeSticker = (id) => {
    setPlacedStickers(placedStickers.filter(sticker => sticker.id !== id));
  };

  // Actualizar la posición de una pegatina
  const updateStickerPosition = (id, position) => {
    setPlacedStickers(placedStickers.map(sticker => 
      sticker.id === id ? { ...sticker, position } : sticker
    ));
  };

  // Guardar la reflexión actual
  const saveReflection = () => {
    if (!reflection.trim()) return;
    
    const newReflection = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      text: reflection,
      background: reflectionBackground,
      style: reflectionStyle,
      stickers: [...placedStickers]
    };
    
    setSavedReflections([newReflection, ...savedReflections]);
    
    // Limpiar el estado actual
    setReflection('');
    setPlacedStickers([]);
    setReflectionBackground('bg-light');
    setReflectionStyle('default');
  };

  // Cargar una reflexión guardada
  const loadReflection = (reflection) => {
    setSelectedReflection(null);
    setShowSavedModal(false);
    
    setReflection(reflection.text);
    setPlacedStickers(reflection.stickers);
    setReflectionBackground(reflection.background);
    setReflectionStyle(reflection.style);
  };

  // Obtener la clase de estilo actual
  const getCurrentStyleClass = () => {
    const style = cardStyles.find(s => s.id === reflectionStyle);
    return style ? style.class : '';
  };

  // Obtener la clase de texto para el fondo actual
  const getCurrentTextClass = () => {
    const bg = cardBackgrounds.find(b => b.id === reflectionBackground);
    return bg ? bg.textClass : 'text-dark';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="daily-reflection-container">
      <h2 className="section-title mb-4">Espacio de Reflexión Diaria</h2>
      
      <Row className="mb-4">
        <Col lg={8}>
          <Card 
            ref={reflectionCardRef}
            className={`reflection-card ${getCurrentStyleClass()} mb-3`}
          >
            <Card.Body 
              className={`${reflectionBackground} ${getCurrentTextClass()} position-relative`}
              style={{ minHeight: '250px', borderRadius: reflectionStyle === 'rounded' ? '0.8rem' : '0.375rem' }}
            >
              {placedStickers.map(sticker => (
                <Draggable
                  key={sticker.id}
                  defaultPosition={sticker.position}
                  bounds="parent"
                  onStop={(e, data) => updateStickerPosition(sticker.id, { x: data.x, y: data.y })}
                >
                  <div className="placed-sticker" style={{ position: 'absolute', zIndex: 10 }}>
                    <img 
                      src={sticker.image} 
                      alt="Sticker" 
                      style={{ width: '80px', height: 'auto' }}
                    />
                    <div className="sticker-controls">
                      <button 
                        className="sticker-control-btn"
                        onClick={() => removeSticker(sticker.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </Draggable>
              ))}
              
              <Form.Control
                as="textarea"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Escribe aquí tu reflexión del día..."
                className={`reflection-textarea border-0 ${getCurrentTextClass()} bg-transparent`}
                style={{ 
                  minHeight: '200px', 
                  resize: 'none',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  zIndex: 5,
                  position: 'relative'
                }}
              />
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setReflection(predefinedReflections[Math.floor(Math.random() * predefinedReflections.length)])}
            >
              <i className="bi bi-lightbulb me-1"></i> Inspiración
            </Button>
            
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => setShowSavedModal(true)}
              >
                <i className="bi bi-journal-text me-1"></i> Ver guardadas
              </Button>
              
              <Button 
                variant="primary"
                onClick={saveReflection}
                disabled={!reflection.trim()}
              >
                <i className="bi bi-save me-1"></i> Guardar reflexión
              </Button>
            </div>
          </div>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="mb-3">Personalizar</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Estilo de tarjeta</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {cardStyles.map(style => (
                    <Button
                      key={style.id}
                      variant={reflectionStyle === style.id ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setReflectionStyle(style.id)}
                    >
                      {style.name}
                    </Button>
                  ))}
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Color de fondo</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {cardBackgrounds.map(bg => (
                    <Button
                      key={bg.id}
                      className={`color-swatch ${bg.id}`}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%',
                        border: reflectionBackground === bg.id ? '2px solid #000' : '1px solid #ddd'
                      }}
                      onClick={() => setReflectionBackground(bg.id)}
                      title={bg.name}
                    />
                  ))}
                </div>
              </Form.Group>
              
              <hr />
              
              <h5 className="mb-3">Añadir stickers</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="sm"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <div className="sticker-gallery">
                <div className="sticker-items">
                  {filteredStickers.map(sticker => (
                    <div 
                      key={sticker.id} 
                      className="sticker-item"
                      onClick={() => addSticker(sticker)}
                      title={sticker.name}
                    >
                      <img 
                        src={sticker.image} 
                        alt={sticker.name}
                        className="img-fluid"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-muted small mt-2">Haz clic en un sticker para añadirlo a tu reflexión</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal para ver reflexiones guardadas */}
      <Modal 
        show={showSavedModal} 
        onHide={() => setShowSavedModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Mis reflexiones guardadas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {savedReflections.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-journal-x mb-3" style={{ fontSize: '2rem' }}></i>
              <p>Aún no has guardado ninguna reflexión</p>
            </div>
          ) : (
            <Row>
              {savedReflections.map(item => (
                <Col md={6} key={item.id} className="mb-3">
                  <Card 
                    className={`h-100 cursor-pointer ${item.id === selectedReflection?.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedReflection(item)}
                  >
                    <Card.Body className={item.background}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg="secondary">{formatDate(item.date)}</Badge>
                        {item.stickers.length > 0 && (
                          <Badge bg="info">{item.stickers.length} stickers</Badge>
                        )}
                      </div>
                      <p className="reflection-preview">
                        {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSavedModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => selectedReflection && loadReflection(selectedReflection)}
            disabled={!selectedReflection}
          >
            Cargar reflexión
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DailyReflection;

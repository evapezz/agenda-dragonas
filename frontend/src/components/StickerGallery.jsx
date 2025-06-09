import React, { useState } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import Draggable from 'react-draggable';
import '../assets/css/stickers.css';

const StickerGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('motivacional');
  const [placedStickers, setPlacedStickers] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  // Categorías de pegatinas
  const categories = [
    { id: 'motivacional', name: 'Motivacionales' },
    { id: 'emocional', name: 'Emocionales' },
    { id: 'medica', name: 'Médicas' },
    { id: 'estacional', name: 'Estacionales' },
    { id: 'personalizada', name: 'Personalizadas' }
  ];

  // Pegatinas de ejemplo (deben venir de la API)
  const stickers = [
    { id: 1, name: 'Dragón Sonriente', category: 'motivacional', image: '/assets/stickers/dragon_smile.png' },
    { id: 2, name: 'Dragón Luchador', category: 'motivacional', image: '/assets/stickers/dragon_fighter.png' },
    { id: 3, name: 'Corazón', category: 'emocional', image: '/assets/stickers/heart.png' },
    { id: 4, name: 'Estrella', category: 'motivacional', image: '/assets/stickers/star.png' },
    { id: 5, name: 'Flor', category: 'estacional', image: '/assets/stickers/flower.png' },
    { id: 6, name: 'Medicamento', category: 'medica', image: '/assets/stickers/medicine.png' },
    { id: 7, name: 'Sol', category: 'estacional', image: '/assets/stickers/sun.png' },
    { id: 8, name: 'Luna', category: 'estacional', image: '/assets/stickers/moon.png' },
    { id: 9, name: 'Arcoíris', category: 'motivacional', image: '/assets/stickers/rainbow.png' },
    { id: 10, name: 'Nube', category: 'emocional', image: '/assets/stickers/cloud.png' }
  ];

  // Filtrar pegatinas por categoría seleccionada
  const filteredStickers = stickers.filter(sticker => sticker.category === selectedCategory);

  // Añadir una pegatina al canvas
  const addSticker = (sticker) => {
    const newSticker = {
      id: Date.now(),
      stickerId: sticker.id,
      image: sticker.image,
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      scale: 1,
      rotation: 0
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

  return (
    <div className="sticker-gallery-container">
      <Button 
        variant="primary" 
        className="mb-3"
        onClick={() => setShowGallery(!showGallery)}
      >
        {showGallery ? 'Cerrar galería' : 'Abrir galería de pegatinas'}
      </Button>
      
      {showGallery && (
        <Card className="mb-4">
          <Card.Body>
            <h2 className="h4 mb-3">Galería de Pegatinas</h2>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                    <div className="placeholder-image">
                      {/* Aquí irá la imagen de la pegatina */}
                      <i className="bi bi-image" style={{fontSize: '2rem'}}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-muted small">Haz clic en una pegatina para añadirla a tu espacio</p>
          </Card.Body>
        </Card>
      )}
      
      <div className="sticker-canvas">
        <h3 className="h5 mb-3">Mi espacio de pegatinas</h3>
        <p className="text-muted small mb-4">Arrastra las pegatinas para colocarlas donde quieras</p>
        
        {placedStickers.map(sticker => (
          <Draggable
            key={sticker.id}
            defaultPosition={sticker.position}
            onStop={(e, data) => updateStickerPosition(sticker.id, { x: data.x, y: data.y })}
          >
            <div className="placed-sticker" style={{ width: '80px', height: '80px' }}>
              <div className="placeholder-image">
                {/* Aquí irá la imagen de la pegatina */}
                <i className="bi bi-image" style={{fontSize: '2rem'}}></i>
              </div>
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
        
        {placedStickers.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-stickies mb-2" style={{fontSize: '2rem'}}></i>
            <p>Añade pegatinas desde la galería para decorar tu espacio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickerGallery;

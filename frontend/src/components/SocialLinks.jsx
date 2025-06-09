import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SocialLinks = ({ links = [] }) => {
  // Si no hay enlaces, mostrar mensaje
  if (links.length === 0) {
    return (
      <div className="social-links-empty text-center py-2">
        <p className="text-muted small mb-0">No hay redes sociales configuradas</p>
      </div>
    );
  }

  // Mapeo de plataformas a iconos de Bootstrap
  const platformIcons = {
    facebook: 'bi-facebook',
    instagram: 'bi-instagram',
    twitter: 'bi-twitter',
    linkedin: 'bi-linkedin',
    youtube: 'bi-youtube',
    tiktok: 'bi-tiktok',
    pinterest: 'bi-pinterest',
    otro: 'bi-link-45deg'
  };

  // Mapeo de plataformas a colores
  const platformColors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
    tiktok: '#000000',
    pinterest: '#BD081C',
    otro: '#6c757d'
  };

  return (
    <div className="social-links">
      <Row className="g-2">
        {links.map((link, index) => (
          <Col key={index} xs={6} md={4} lg={3}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <Card className="social-link-card h-100">
                <Card.Body className="d-flex align-items-center p-2">
                  <i 
                    className={`bi ${platformIcons[link.platform] || 'bi-link-45deg'}`} 
                    style={{ 
                      fontSize: '1.5rem', 
                      color: platformColors[link.platform] || '#6c757d',
                      marginRight: '10px'
                    }}
                  ></i>
                  <div>
                    <div className="social-platform-name">{link.platform}</div>
                    <div className="social-username text-truncate small text-muted">
                      {link.username || 'Ver perfil'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SocialLinks;

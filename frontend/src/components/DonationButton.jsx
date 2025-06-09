// frontend/src/components/DonationButton.jsx

import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

const DonationButton = ({ variant = "primary", size = "md", className = "", showText = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [donationMethod, setDonationMethod] = useState('bizum');
  
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={`donation-button ${className}`}
        onClick={handleShow}
      >
        <i className="bi bi-heart-fill me-2"></i>
        {showText && "Donar a Dragonboat Granada"}
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-primary">Apoya a Dragonboat Granada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <img 
              src="favicon.svg" 
              alt="Dragonboat Granada" 
              className="img-fluid rounded mb-3" 
              style={{ maxHeight: '200px' }}
            />
            <h5>Tu donación marca la diferencia</h5>
            <p className="text-muted">
              Esta web y su uso es público y gratuito. <br/> Si deseas colaborar con las Dragonas en sus actividades, aporta lo que desees.<br/> ¡Muchas gracias!.
            </p>
          </div>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Selecciona un método de donación:</Form.Label>
              <div className="donation-methods">
                <Row>
                  <Col xs={6}>
                    <div 
                      className={`donation-method-card ${donationMethod === 'bizum' ? 'active' : ''}`}
                      onClick={() => setDonationMethod('bizum')}
                    >
                      <div className="donation-method-icon">
                        <i className="bi bi-phone"></i>
                      </div>
                      <h6>Bizum</h6>
                      <small className="text-muted">Rápido y seguro</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`donation-method-card ${donationMethod === 'transfer' ? 'active' : ''}`}
                      onClick={() => setDonationMethod('transfer')}
                    >
                      <div className="donation-method-icon">
                        <i className="bi bi-bank"></i>
                      </div>
                      <h6>Transferencia</h6>
                      <small className="text-muted">Banco o tarjeta</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form.Group>

            {donationMethod === 'bizum' && (
              <div className="bizum-info p-3 border rounded text-center">
                <h5 className="mb-3">Bizum al número:</h5>
                <div className="bizum-number fw-bold fs-4 mb-3">612 345 678</div>
                <p className="text-muted mb-0">
                  <small>Envía tu donación indicando "Donación Dragonboat" en el concepto</small>
                </p>
              </div>
            )}

            {donationMethod === 'transfer' && (
              <div className="transfer-info p-3 border rounded text-center">
                <h5 className="mb-3">Datos bancarios:</h5>
                <p className="mb-2"><strong>Titular:</strong> Asociación Dragonboat Granada</p>
                <p className="mb-2"><strong>IBAN:</strong> ES12 3456 7890 1234 5678 9012</p>
                <p className="mb-2"><strong>Entidad:</strong> Banco Ejemplo</p>
                <p className="text-muted mb-0">
                  <small>Indica "Donación Dragonboat" en el concepto de la transferencia</small>
                </p>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <p className="text-center w-100 mb-0">
            <small className="text-muted">
              Todas las donaciones son destinadas íntegramente a los programas de apoyo de Dragonboat Granada.
              <br />Para más información, contacta con <a href="mailto:info@dragonboatgranada.org">info@dragonboatgranada.org</a>
            </small>
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DonationButton;

import React from 'react';
import { Container } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <img src="/favicon.svg" alt="Logo" width="80" height="80" className="mb-4" />
      <h1>404 - Página no encontrada</h1>
      <p className="lead">Lo sentimos, la página que estás buscando no existe.</p>
      <p>Vuelve a la <a href="/">página principal</a> para continuar navegando.</p>
    </Container>
  );
};

export default NotFound;

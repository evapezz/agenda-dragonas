import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-dark py-3 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          {/* Columna izquierda: imagen + texto */}
          <div className="col-md-6 d-flex align-items-center">
            {/*siricat.png en public/ */}
            <img
              src="siricat.png"
              alt="SiriCat"
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            <div>
              <p className="mb-0">© SiriCat 2025</p>
              <p className="mb-0 small">
                <Link to="/politica-privacidad" className="text-decoration-none">
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </div>
          {/* Columna derecha: texto */}
          <div className="col-md-6 text-md-end">
            <p className="mb-0">A las mujeres de <a href="/dragon.mp4" target="_blank">dragonboat de Granada</a> que, ante la adversidad, reman juntas. <br/>Y a ti, cuya alegría y amor a la vida inspiran todo.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


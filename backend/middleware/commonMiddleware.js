const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Configura middleware general para las rutas
module.exports = (app) => {
  // Habilita CORS
  app.use(cors());

  // Parseo de JSON y datos de formularios
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Registro de peticiones en consola
  app.use(morgan('dev'));
};

Agenda Dragonas

##  Descripción

La Agenda Digital de Dragonas es una aplicación web profesional diseñada específicamente para mujeres que enfrentan el cáncer. Proporciona un ecosistema integral de herramientas para el manejo de la salud, bienestar emocional y conexión comunitaria.

### Características Principales

- ** Gestión de Salud**: Registro detallado de síntomas, seguimiento de tratamientos y gestión de citas médicas
- ** Centro de Motivación**: Reflexiones diarias, frases inspiradoras y seguimiento del bienestar emocional
- ** Comunidad de Apoyo**: Conexión con otras mujeres, grupos de apoyo y recursos compartidos
- ** Panel Médico**: Herramientas especializadas para profesionales de la salud
- ** Administración**: Panel completo para gestión del sistema y moderación de contenido

## Inicio Rápido

### Prerrequisitos

- Node.js 18.0+ 
- MySQL 8.0+
- Docker y Docker Compose (recomendado)

### Instalación con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/evapezz/agenda-dragonas.git
cd agenda-dragonas

# Construir y ejecutar
docker-compose up --build -d

# Inicializar base de datos
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

La aplicación estará disponible en `http://localhost:5173`

### Instalación Manual


#### Backend
```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```
</details>

## Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│     Backend     │◄──►│     MySQL       │
│   (React 18)    │    │   (Node.js)     │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack Tecnológico

**Frontend:**
- React 18.2 
- React Router DOM 6.15
- Bootstrap 5 + React Bootstrap
- Recharts para visualizaciones
- Vite como build tool

**Backend:**
- Node.js 18 + Express.js
- MySQL 8.0
- JWT para autenticación
- Bcrypt para seguridad de contraseñas
- Rate limiting y middleware de seguridad

**DevOps:**
- Docker y Docker Compose
- Nginx para producción
- Jest para testing
- ESLint + Prettier para calidad de código

## Estructura del Proyecto

```
agenda-dragonas/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── contexts/       # Context API para estado global
│   │   ├── services/       # Servicios API
│   │   └── styles/         # Estilos CSS personalizados
│   ├── public/             # Archivos estáticos
│   └── dist/               # Build de producción
├── backend/                 # API Node.js
│   ├── controllers/        # Lógica de controladores
│   ├── models/            # Modelos de Sequelize
│   ├── routes/            # Definición de rutas
│   ├── middleware/        # Middleware personalizado
│   ├── config/            # Configuraciones
│   └── tests/             # Tests unitarios e integración
├── docs/                   # Documentación
├── mysql-init/            # Scripts de inicialización DB
└── docker-compose.yml     # Configuración Docker
```

## Configuración
  
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Agenda Digital de Dragonas
```

## Testing

```bash
# Tests del backend
cd backend
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

##  Documentación

- [ Documentación Técnica Completa](docs/documentacion_tecnica.md)
- [ Guía de Despliegue](docs/DEPLOYMENT.md)
- [ Especificaciones Técnicas](docs/especificaciones_tecnicas.md)


##  Seguridad

- Autenticación JWT con tokens de corta duración
- Encriptación de contraseñas con bcrypt
- Rate limiting para prevenir ataques
- Validación exhaustiva de entrada de datos
- Headers de seguridad con Helmet.js
- CORS configurado específicamente

##  Despliegue

### Producción con Docker

```bash
# Configurar para producción
export NODE_ENV=production

# Construir imágenes optimizadas
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx + SSL

```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

##  Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar ESLint y Prettier
- Escribir tests para nuevas funcionalidades
- Seguir convenciones de naming
- Documentar cambios importantes

##  Métricas de Rendimiento

- **Frontend**: FCP < 1.5s, LCP < 2.5s
- **Backend**: Respuesta API < 200ms
- **Base de Datos**: Consultas < 50ms
- **Disponibilidad**: 99.9% uptime


##  Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

##  Equipo

- **Desarrollo**: Eva Pérez Pérez
- **Diseño UX/UI**: Eva Pérez Pérez
- **Consultoría Médica**: Profesionales especializados en oncología

##  Agradecimientos

- A todas las mujeres valientes que inspiraron este proyecto
- A la comunidad open source por las herramientas utilizadas
- A los Profesionales especializados en oncología
---

<div align="center">
  <strong>Hecho con ❤️ para la comunidad de Dragonas</strong>
</div>

=======
# agenda-dragonas
Agenda digital oncológica para Dragonas


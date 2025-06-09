# Estructura del Proyecto Agenda de Dragonas

## Estructura General

```
agenda-dragones/
├── frontend/                  # Aplicación React
│   ├── public/                # Archivos estáticos
│   ├── src/                   # Código fuente React
│   │   ├── assets/            # Recursos (imágenes, CSS, etc.)
│   │   │   ├── css/           # Estilos CSS
│   │   │   ├── images/        # Imágenes
│   │   │   └── stickers/      # Pegatinas virtuales
│   │   ├── components/        # Componentes React
│   │   ├── contexts/          # Contextos de React (Auth, etc.)
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Servicios API
│   │   ├── utils/             # Utilidades
│   │   ├── App.jsx            # Componente principal
│   │   └── main.jsx           # Punto de entrada
│   ├── .env                   # Variables de entorno frontend
│   ├── package.json           # Dependencias frontend
│   └── Dockerfile             # Configuración Docker frontend
│
├── backend/                   # API Node.js/Express
│   ├── controllers/           # Controladores
│   ├── models/                # Modelos
│   ├── routes/                # Rutas API
│   ├── middleware/            # Middleware (auth, validación)
│   ├── utils/                 # Utilidades
│   ├── db/                    # Scripts y configuración BD
│   │   └── update_schema.sql  # Actualizaciones de esquema
│   ├── server.js              # Punto de entrada
│   ├── .env                   # Variables de entorno backend
│   ├── package.json           # Dependencias backend
│   └── Dockerfile             # Configuración Docker backend
│
├── mysql-init/                # Scripts inicialización MySQL
│   └── 01-schema.sql          # Esquema inicial de la BD
│
├── docs/                      # Documentación
│   ├── especificaciones_tecnicas.md
│   ├── estructura_proyecto.md
│   └── guia_implementacion.md
│
└── docker-compose.yml         # Configuración Docker Compose
```

## Componentes Principales

### Frontend (React)

#### Páginas Principales
- Login/Registro
- Panel Principal (Dashboard)
- Agenda de Citas
- Registro de Síntomas
- Espacio Motivacional
- Configuración de Perfil
- Panel de Médicos

#### Componentes Clave
- Auth (Autenticación)
- Calendar (Calendario)
- SymptomsTracker (Seguimiento de síntomas)
- MotivationalSpace (Espacio motivacional)
- SocialLinks (Enlaces a redes sociales)
- StickerGallery (Galería de pegatinas)
- DoctorPanel (Panel para médicos)
- DataSharing (Compartir datos con médicos)

### Backend (Node.js/Express)

#### Controladores
- AuthController (Registro, login, gestión de usuarios)
- AppointmentController (Gestión de citas)
- SymptomController (Registro de síntomas)
- MotivationalController (Contenido motivacional)
- StickerController (Gestión de pegatinas)
- DoctorController (Funcionalidades para médicos)
- SocialController (Gestión de redes sociales)

#### Modelos
- User (Usuarios: dragonas, médicos, administradores)
- Appointment (Citas médicas y personales)
- Symptom (Registro de síntomas)
- MotivationalContent (Contenido motivacional)
- Sticker (Pegatinas virtuales)
- SocialLink (Enlaces a redes sociales)
- SharedData (Datos compartidos con médicos)

### Base de Datos (MySQL)

#### Tablas Principales
- users (Usuarios del sistema)
- appointments (Citas)
- symptoms (Síntomas)
- motivational_content (Contenido motivacional)
- stickers (Pegatinas disponibles)
- sticker_placements (Ubicación de pegatinas)
- social_links (Enlaces a redes sociales)
- shared_data (Datos compartidos con médicos)

### Docker

- Contenedor Frontend (Vite+React)
- Contenedor Backend (Node.js + Express)
- Contenedor MySQL (Base de datos)

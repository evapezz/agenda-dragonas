# Documentación Técnica - Agenda Digital de Dragonas

**Versión:** 2.0.0  
**Fecha:** Junio 2025  
**Estado:** Producción Ready

---
## Resumen Ejecutivo

La Agenda Digital de Dragonas es una aplicación web  diseñada específicamente para mujeres que enfrentan el cáncer, proporcionando un ecosistema integral de herramientas para el manejo de su salud, bienestar emocional y conexión comunitaria. Esta plataforma representa una solución tecnológica avanzada que combina funcionalidades médicas, de seguimiento personal y apoyo psicosocial en una interfaz unificada y accesible.


### Características Principales

La plataforma ofrece un conjunto completo de funcionalidades diseñadas para abordar las necesidades específicas de las usuarias:

**Sistema de Gestión de Salud:** Permite el registro detallado de síntomas con escalas de medición validadas, seguimiento de tratamientos médicos, gestión de citas con profesionales de la salud, y generación de reportes médicos exportables. El sistema incluye visualizaciones gráficas de la evolución del bienestar y alertas automáticas para situaciones que requieren atención médica.

**Centro de Motivación y Bienestar:** Incorpora un sistema de reflexión diaria con stickers emocionales, frases motivacionales personalizadas, seguimiento del estado de ánimo y energía, y un historial completo de logros y gratitudes. Esta sección está diseñada para promover el autocuidado y el bienestar mental.

**Comunidad de Apoyo:** Facilita la conexión entre usuarias a través de grupos temáticos, foros de discusión moderados, intercambio de experiencias y recursos, y eventos virtuales de apoyo. La comunidad está diseñada con estrictos protocolos de privacidad y moderación.

**Panel Médico Especializado:** Proporciona a los profesionales de la salud herramientas para monitorear a sus pacientes, revisar historiales médicos, programar citas, generar reportes clínicos y comunicarse de manera segura con las usuarias.

**Sistema de Administración:** Incluye un panel completo para la gestión de usuarios, moderación de contenido, análisis de uso de la plataforma, gestión de contenido motivacional y configuración del sistema.




## Arquitectura del Sistema

### Arquitectura General

La Agenda Digital de Dragonas implementa una arquitectura de microservicios moderna basada en el patrón MVC (Model-View-Controller) con separación clara entre frontend y backend. Esta arquitectura garantiza escalabilidad, mantenibilidad y facilita el desarrollo colaborativo.

**Frontend (Cliente):** Desarrollado en React 18 con TypeScript, utiliza React Router para navegación, Context API para gestión de estado global, y Bootstrap 5 para el sistema de diseño. La aplicación está optimizada para dispositivos móviles y de escritorio, implementando principios de Progressive Web App (PWA).

**Backend (Servidor):** Construido con Node.js y Express.js, implementa una API RESTful completa con autenticación JWT, validación de datos con Joi, rate limiting, y middleware de seguridad. El servidor está configurado para manejar cargas altas y proporcionar respuestas rápidas.

**Base de Datos:** Utiliza MySQL 8.0 como sistema de gestión de base de datos relacional, con Sequelize como ORM para la abstracción de datos. La base de datos está optimizada con índices apropiados y relaciones bien definidas.

**Infraestructura:** El sistema está containerizado con Docker y Docker Compose, facilitando el despliegue en cualquier entorno. Incluye configuraciones para desarrollo, testing y producción.

### Patrones de Diseño Implementados

**Repository Pattern:** Implementado a través de los modelos de Sequelize, proporcionando una abstracción limpia para el acceso a datos y facilitando el testing mediante mocking.

**Middleware Pattern:** Utilizado extensivamente en Express.js para autenticación, autorización, validación, logging y manejo de errores. Cada middleware tiene una responsabilidad específica y puede ser reutilizado.

**Observer Pattern:** Implementado en el frontend a través del Context API de React para la gestión de estado global, permitiendo que los componentes reaccionen automáticamente a cambios de estado.

**Factory Pattern:** Utilizado para la creación de instancias de modelos de base de datos y configuraciones específicas según el entorno de ejecución.

### Flujo de Datos

El flujo de datos en la aplicación sigue un patrón unidireccional que garantiza predictibilidad y facilita el debugging:

1. **Interacción del Usuario:** El usuario interactúa con componentes React en el frontend
2. **Dispatch de Acciones:** Los componentes disparan acciones que actualizan el estado global
3. **Llamadas API:** Los servicios del frontend realizan peticiones HTTP al backend
4. **Procesamiento Backend:** El servidor procesa las peticiones, valida datos y ejecuta lógica de negocio
5. **Acceso a Datos:** Los controladores utilizan modelos para interactuar con la base de datos
6. **Respuesta:** Los datos se devuelven al frontend siguiendo el mismo camino en reversa
7. **Actualización UI:** Los componentes React se re-renderizan automáticamente con los nuevos datos

### Seguridad por Capas

La arquitectura implementa seguridad en múltiples capas:

**Capa de Red:** Configuración HTTPS obligatoria, headers de seguridad con Helmet.js, y CORS configurado específicamente para dominios autorizados.

**Capa de Aplicación:** Autenticación JWT con tokens de corta duración, autorización basada en roles, validación exhaustiva de entrada de datos, y rate limiting para prevenir ataques de fuerza bruta.

**Capa de Datos:** Encriptación de contraseñas con bcrypt, consultas parametrizadas para prevenir inyección SQL, y auditoría de acceso a datos sensibles.

**Capa de Infraestructura:** Contenedores Docker con configuraciones de seguridad, variables de entorno para secretos, y logs de seguridad centralizados.

## Especificaciones Técnicas

### Stack Tecnológico Frontend

**React 18.2.0:** Framework principal para la construcción de la interfaz de usuario, aprovechando las últimas características como Concurrent Features, Automatic Batching, y Suspense mejorado.

**React Router DOM 6.15.0:** Biblioteca de enrutamiento que proporciona navegación declarativa, lazy loading de componentes, y gestión avanzada del historial del navegador.

**React Bootstrap 2.8.0:** Biblioteca de componentes UI que combina la potencia de Bootstrap con la flexibilidad de React, proporcionando componentes accesibles y responsivos.

**Recharts 2.7.2:** Biblioteca de gráficos construida sobre D3.js, optimizada para React, que proporciona visualizaciones interactivas y responsivas para datos de salud y bienestar.

**Axios 1.5.0:** Cliente HTTP que maneja todas las comunicaciones con el backend, incluyendo interceptores para autenticación automática y manejo de errores.

**React Hook Form 7.45.4:** Biblioteca para gestión de formularios que minimiza re-renders y proporciona validación robusta con excelente experiencia de usuario.

### Stack Tecnológico Backend

**Node.js 18.17.0:** Runtime de JavaScript que proporciona un entorno de ejecución eficiente y escalable para el servidor, con soporte completo para ES6+ y APIs modernas.

**Express.js 4.18.2:** Framework web minimalista y flexible que proporciona un conjunto robusto de características para aplicaciones web y móviles, con middleware extensible.

**Sequelize 6.32.1:** ORM moderno para Node.js que soporta PostgreSQL, MySQL, MariaDB, SQLite y Microsoft SQL Server, proporcionando abstracción de base de datos y migraciones.

**MySQL 8.0:** Sistema de gestión de base de datos relacional que ofrece alto rendimiento, confiabilidad y facilidad de uso, con características avanzadas de seguridad.

**JSON Web Tokens (JWT) 9.0.2:** Estándar abierto para la transmisión segura de información entre partes, utilizado para autenticación y autorización sin estado.

**Bcrypt.js 2.4.3:** Biblioteca de hashing de contraseñas que implementa el algoritmo bcrypt, proporcionando protección contra ataques de fuerza bruta y rainbow tables.

### Herramientas de Desarrollo

**Vite 4.4.9:** Build tool moderno que proporciona desarrollo rápido con Hot Module Replacement (HMR) y builds optimizados para producción.

**ESLint 8.47.0:** Herramienta de linting que identifica y reporta patrones problemáticos en código JavaScript, manteniendo consistencia y calidad del código.

**Prettier 3.0.2:** Formateador de código que asegura un estilo consistente en todo el proyecto, integrado con ESLint para una experiencia de desarrollo fluida.

**Jest 29.6.2:** Framework de testing que proporciona testing unitario, de integración y de snapshot, con cobertura de código y mocking avanzado.

**Nodemon 3.0.1:** Utilidad que monitorea cambios en archivos y reinicia automáticamente el servidor durante el desarrollo, mejorando la productividad.

### Configuración de Entornos

**Desarrollo:** Configurado con hot reloading, source maps detallados, logging verbose, y herramientas de debugging. Base de datos local con datos de prueba.

**Testing:** Entorno aislado con base de datos en memoria, mocking de servicios externos, y configuración optimizada para ejecución rápida de tests.

**Staging:** Réplica exacta del entorno de producción con datos sintéticos, utilizado para testing de integración y validación final antes del despliegue.

**Producción:** Configuración optimizada para rendimiento con minificación, compresión, caching agresivo, logging de errores, y monitoreo de rendimiento.

### Requisitos del Sistema

**Servidor de Aplicación:**
- CPU: Mínimo 2 cores, recomendado 4+ cores
- RAM: Mínimo 4GB, recomendado 8GB+
- Almacenamiento: Mínimo 20GB SSD
- Red: Conexión estable con ancho de banda mínimo de 100Mbps

**Base de Datos:**
- CPU: Mínimo 2 cores dedicados
- RAM: Mínimo 4GB, recomendado 8GB+
- Almacenamiento: SSD con IOPS altos, mínimo 50GB
- Backup: Almacenamiento adicional para respaldos automáticos

**Cliente (Navegador):**
- Navegadores soportados: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- JavaScript habilitado
- Cookies y Local Storage habilitados
- Conexión a internet estable

### Métricas de Rendimiento

**Frontend:**
- First Contentful Paint (FCP): < 1.5 segundos
- Largest Contentful Paint (LCP): < 2.5 segundos
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100 milisegundos

**Backend:**
- Tiempo de respuesta API: < 200ms para operaciones simples
- Tiempo de respuesta API: < 500ms para operaciones complejas
- Throughput: > 1000 requests por segundo
- Disponibilidad: 99.9% uptime

**Base de Datos:**
- Tiempo de consulta: < 50ms para consultas simples
- Tiempo de consulta: < 200ms para consultas complejas con joins
- Conexiones concurrentes: Soporte para 100+ conexiones simultáneas


## Guía de Instalación

### Prerrequisitos del Sistema

Antes de proceder con la instalación de la Agenda Digital de Dragonas, es fundamental verificar que el sistema cumple con todos los prerrequisitos necesarios. Esta sección detalla los componentes requeridos y las versiones mínimas soportadas.

**Node.js y npm:** El sistema requiere Node.js versión 18.0.0 o superior. Node.js es el runtime de JavaScript que ejecuta el servidor backend, mientras que npm es el gestor de paquetes utilizado para instalar las dependencias. Para verificar la versión instalada, ejecute `node --version` y `npm --version` en la terminal. Si no tiene Node.js instalado o su versión es anterior a la requerida, descargue la versión LTS más reciente desde el sitio oficial de Node.js.

**MySQL Server:** La aplicación utiliza MySQL 8.0 como sistema de gestión de base de datos. MySQL debe estar instalado y ejecutándose en el servidor. Durante la instalación, asegúrese de configurar un usuario con privilegios suficientes para crear bases de datos y tablas. Anote las credenciales de acceso, ya que serán necesarias durante la configuración.

**Docker y Docker Compose (Opcional pero Recomendado):** Para facilitar el despliegue y garantizar consistencia entre entornos, se recomienda utilizar Docker. Docker Compose versión 2.0 o superior es necesario para orquestar los múltiples servicios de la aplicación. Esta opción simplifica significativamente el proceso de instalación y configuración.

**Git:** Sistema de control de versiones necesario para clonar el repositorio del proyecto. Asegúrese de tener Git instalado y configurado con sus credenciales.

### Instalación con Docker (Recomendado)

La instalación con Docker es el método más sencillo y confiable para desplegar la Agenda Digital de Dragonas. Este enfoque garantiza que la aplicación funcione de manera consistente independientemente del sistema operativo host.

**Paso 1: Clonar el Repositorio**
```bash
git clone https://github.com/tu-organizacion/agenda-dragonas.git
cd agenda-dragonas
```

**Paso 2: Configurar Variables de Entorno**
Copie los archivos de ejemplo de variables de entorno y configúrelos según su entorno:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edite el archivo `backend/.env` con los siguientes valores mínimos:
```
host.docker.internal
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=Agenda

**Paso 3: Construir y Ejecutar con Docker Compose**
```bash
docker-compose up --build -d
```

Este comando construirá las imágenes Docker para el frontend, backend y base de datos, y ejecutará todos los servicios en segundo plano. El proceso puede tomar varios minutos la primera vez, ya que debe descargar las imágenes base y instalar todas las dependencias.

**Paso 4: Verificar la Instalación**
Una vez completado el proceso, verifique que todos los servicios estén ejecutándose:
```bash
docker-compose ps
```

Debería ver tres servicios en estado "Up": frontend, backend y mysql. La aplicación estará disponible en `http://localhost:5173`.

**Paso 5: Inicializar la Base de Datos**
Ejecute las migraciones y seeders para configurar la estructura inicial de la base de datos:
```bash
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

### Instalación Manual

Para entornos de desarrollo o cuando Docker no esté disponible, puede realizar una instalación manual siguiendo estos pasos detallados.

**Paso 1: Preparar la Base de Datos**
Conecte a MySQL como administrador y cree la base de datos y usuario:
```sql
CREATE DATABASE agenda_dragonas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dragonas_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON agenda_dragonas.* TO 'dragonas_user'@'localhost';
FLUSH PRIVILEGES;
```

**Paso 2: Configurar el Backend**
```bash
cd backend
npm install
cp .env.example .env
```

Edite el archivo `.env` con las credenciales de base de datos configuradas anteriormente. Luego, ejecute las migraciones:
```bash
npm run migrate
npm run seed
```

**Paso 3: Configurar el Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

Configure la URL del backend en el archivo `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

**Paso 4: Construir el Frontend**
```bash
npm run build
```

**Paso 5: Ejecutar la Aplicación**
En terminales separadas, ejecute:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (para desarrollo)
cd frontend
npm run dev
```

Para producción, configure un servidor web como Nginx para servir los archivos estáticos del frontend y hacer proxy al backend.

### Configuración de Nginx (Producción)

Para despliegues en producción, configure Nginx como servidor web y proxy reverso:

```nginx
server {
    listen 80;
    agenda-dragonas.com;
    
    # Frontend estático
    location / {
        root /path/to/agenda-dragonas/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Configuración SSL/HTTPS

Para habilitar HTTPS en producción, utilice Let's Encrypt con Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### Verificación de la Instalación

Después de completar la instalación, verifique que todos los componentes funcionen correctamente:

1. **Acceso a la Aplicación:** Navegue a la URL configurada y verifique que la página de inicio cargue correctamente.

2. **Registro de Usuario:** Cree una cuenta de prueba para verificar el sistema de autenticación.

3. **Funcionalidades Básicas:** Pruebe el registro de síntomas, navegación entre páginas, y acceso al panel de usuario.

4. **Logs del Sistema:** Revise los logs del backend para asegurar que no hay errores críticos:
```bash
# Con Docker
docker-compose logs backend

# Instalación manual
tail -f backend/logs/app.log
```

5. **Base de Datos:** Verifique que las tablas se crearon correctamente:
```sql
USE agenda_dragonas;
SHOW TABLES;
```

### Solución de Problemas Comunes

**Error de Conexión a Base de Datos:** Verifique que MySQL esté ejecutándose y que las credenciales en el archivo `.env` sean correctas. Asegúrese de que el usuario tenga los permisos necesarios.

**Puerto en Uso:** Si recibe errores sobre puertos ocupados, modifique los puertos en los archivos de configuración o detenga los servicios que estén utilizando esos puertos.

**Problemas de Permisos:** En sistemas Unix/Linux, asegúrese de que el usuario tenga permisos de lectura y escritura en el directorio del proyecto.

**Memoria Insuficiente:** Si la construcción de Docker falla por memoria insuficiente, aumente la memoria asignada a Docker o utilice la instalación manual.

## API Documentation

### Arquitectura de la API

La API de la Agenda Digital de Dragonas está diseñada siguiendo los principios REST (Representational State Transfer), proporcionando una interfaz consistente y predecible para todas las operaciones del sistema. La API utiliza JSON como formato de intercambio de datos y implementa códigos de estado HTTP estándar para comunicar el resultado de las operaciones.

**Base URL:** Todas las rutas de la API están prefijadas con `/api/v1/` para permitir versionado futuro. En el entorno de desarrollo local, la URL base completa es `http://localhost:5000/api/v1/`.

**Autenticación:** La API utiliza JSON Web Tokens (JWT) para autenticación. Después del login exitoso, el cliente recibe un token que debe incluirse en el header `Authorization` de todas las peticiones subsecuentes con el formato `Bearer <token>`.

**Formato de Respuesta:** Todas las respuestas siguen un formato consistente que incluye un código de estado, mensaje descriptivo, y datos cuando corresponde. Las respuestas de error incluyen detalles adicionales para facilitar el debugging.

### Endpoints de Autenticación

**POST /api/auth/register**
Registra un nuevo usuario en el sistema. Este endpoint valida los datos de entrada, verifica que el email y username no estén en uso, hashea la contraseña, y crea el usuario en la base de datos.

Parámetros del cuerpo de la petición:
- `username` (string, requerido): Nombre de usuario único, 3-30 caracteres
- `email` (string, requerido): Dirección de email válida y única
- `password` (string, requerido): Contraseña de al menos 6 caracteres
- `name` (string, requerido): Nombre del usuario
- `last_name` (string, requerido): Apellido del usuario
- `role` (string, opcional): Rol del usuario (dragona, medico, admin), por defecto 'dragona'

Ejemplo de petición:
```json
{
  "username": "maria_gonzalez",
  "email": "maria@example.com",
  "password": "miPassword123",
  "name": "María",
  "last_name": "González",
  "role": "dragona"
}
```

Respuesta exitosa (201):
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "maria_gonzalez",
    "email": "maria@example.com",
    "name": "María",
    "last_name": "González",
    "role": "dragona",
    "profile_image": null
  }
}
```

**POST /api/auth/login**
Autentica un usuario existente y devuelve un token de acceso. Valida las credenciales contra la base de datos y actualiza la fecha de último acceso.

Parámetros del cuerpo de la petición:
- `username` (string, requerido): Nombre de usuario o email
- `password` (string, requerido): Contraseña del usuario

Ejemplo de petición:
```json
{
  "username": "maria_gonzalez",
  "password": "miPassword123"
}
```

Respuesta exitosa (200):
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "maria_gonzalez",
    "email": "maria@example.com",
    "name": "María",
    "last_name": "González",
    "role": "dragona",
    "profile_image": null
  }
}
```

**GET /api/auth/verify**
Verifica la validez de un token JWT y devuelve la información del usuario asociado. Este endpoint es utilizado para mantener la sesión del usuario y verificar permisos.

Headers requeridos:
- `Authorization: Bearer <token>`

Respuesta exitosa (200):
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "maria_gonzalez",
    "email": "maria@example.com",
    "name": "María",
    "last_name": "González",
    "role": "dragona",
    "profile_image": null
  }
}
```

### Endpoints de Síntomas

**POST /api/symptoms**
Crea un nuevo registro de síntomas para el usuario autenticado. Este endpoint valida que todos los niveles estén en el rango 1-10 y que la fecha no sea futura.

Parámetros del cuerpo de la petición:
- `date` (string, requerido): Fecha en formato YYYY-MM-DD
- `pain_level` (integer, requerido): Nivel de dolor (1-10)
- `fatigue_level` (integer, requerido): Nivel de fatiga (1-10)
- `nausea_level` (integer, requerido): Nivel de náusea (1-10)
- `anxiety_level` (integer, requerido): Nivel de ansiedad (1-10)
- `sleep_level` (integer, requerido): Calidad del sueño (1-10)
- `appetite_level` (integer, requerido): Nivel de apetito (1-10)
- `notes` (string, opcional): Notas adicionales (máximo 1000 caracteres)

Ejemplo de petición:
```json
{
  "date": "2025-06-09",
  "pain_level": 5,
  "fatigue_level": 7,
  "nausea_level": 3,
  "anxiety_level": 4,
  "sleep_level": 6,
  "appetite_level": 5,
  "notes": "Día regular, algo de fatiga por la mañana"
}
```

Respuesta exitosa (201):
```json
{
  "message": "Síntoma registrado exitosamente",
  "symptom": {
    "id": 1,
    "user_id": 1,
    "date": "2025-06-09",
    "pain_level": 5,
    "fatigue_level": 7,
    "nausea_level": 3,
    "anxiety_level": 4,
    "sleep_level": 6,
    "appetite_level": 5,
    "notes": "Día regular, algo de fatiga por la mañana",
    "created_at": "2025-06-09T10:30:00.000Z",
    "updated_at": "2025-06-09T10:30:00.000Z"
  }
}
```

**GET /api/symptoms**
Obtiene el historial de síntomas del usuario autenticado con soporte para paginación, filtrado por fechas, y ordenamiento.

Parámetros de consulta opcionales:
- `page` (integer): Número de página (por defecto 1)
- `limit` (integer): Elementos por página (por defecto 10, máximo 100)
- `start_date` (string): Fecha de inicio en formato YYYY-MM-DD
- `end_date` (string): Fecha de fin en formato YYYY-MM-DD
- `sort` (string): Campo de ordenamiento (date, pain_level, etc.)
- `order` (string): Dirección del ordenamiento (asc, desc)

Ejemplo de petición:
```
GET /api/symptoms?page=1&limit=5&start_date=2025-06-01&end_date=2025-06-09&sort=date&order=desc
```

Respuesta exitosa (200):
```json
{
  "symptoms": [
    {
      "id": 1,
      "date": "2025-06-09",
      "pain_level": 5,
      "fatigue_level": 7,
      "nausea_level": 3,
      "anxiety_level": 4,
      "sleep_level": 6,
      "appetite_level": 5,
      "notes": "Día regular, algo de fatiga por la mañana",
      "created_at": "2025-06-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**GET /api/symptoms/stats**
Proporciona estadísticas y análisis de los síntomas del usuario, incluyendo promedios, tendencias, y patrones identificados.

Parámetros de consulta opcionales:
- `period` (string): Período de análisis (week, month, quarter, year)
- `start_date` (string): Fecha de inicio para el análisis
- `end_date` (string): Fecha de fin para el análisis

Respuesta exitosa (200):
```json
{
  "stats": {
    "averages": {
      "pain_level": 5.2,
      "fatigue_level": 6.8,
      "nausea_level": 3.1,
      "anxiety_level": 4.5,
      "sleep_level": 6.3,
      "appetite_level": 5.7
    },
    "trends": {
      "pain_level": "stable",
      "fatigue_level": "improving",
      "overall_wellness": "improving"
    },
    "patterns": {
      "worst_day_of_week": "Monday",
      "best_day_of_week": "Saturday",
      "most_problematic_symptom": "fatigue_level"
    },
    "period": {
      "start_date": "2025-05-09",
      "end_date": "2025-06-09",
      "total_records": 31
    }
  }
}
```

### Endpoints de Contenido Motivacional

**POST /api/motivational/reflection**
Crea una nueva reflexión diaria para el usuario autenticado. Solo se permite una reflexión por día por usuario.

Parámetros del cuerpo de la petición:
- `date` (string, requerido): Fecha en formato YYYY-MM-DD
- `mood` (integer, requerido): Estado de ánimo (1-10)
- `energy` (integer, requerido): Nivel de energía (1-10)
- `gratitude` (string, opcional): Texto de gratitud
- `achievement` (string, opcional): Logro del día
- `notes` (string, opcional): Notas adicionales
- `stickers` (array, opcional): Array de stickers seleccionados

Ejemplo de petición:
```json
{
  "date": "2025-06-09",
  "mood": 7,
  "energy": 6,
  "gratitude": "Agradezco el apoyo de mi familia",
  "achievement": "Completé mi rutina de ejercicios",
  "notes": "Día productivo y positivo",
  "stickers": [
    {"id": 1, "emoji": "😊", "name": "Feliz"},
    {"id": 2, "emoji": "💪", "name": "Fuerte"}
  ]
}
```

**GET /api/motivational/reflections**
Obtiene el historial de reflexiones del usuario con paginación y filtros.

**GET /api/motivational/quotes**
Proporciona frases motivacionales aleatorias o específicas para el usuario.

### Endpoints de Administración

**GET /api/admin/users**
Obtiene la lista de usuarios del sistema (solo para administradores). Incluye filtros por rol, estado, y fecha de registro.

**GET /api/admin/stats**
Proporciona estadísticas generales del sistema incluyendo número de usuarios activos, registros de síntomas, reflexiones completadas, y métricas de uso.

**PUT /api/admin/users/:id/status**
Permite activar o desactivar usuarios del sistema.

### Códigos de Estado HTTP

La API utiliza códigos de estado HTTP estándar para comunicar el resultado de las operaciones:

- **200 OK:** Petición exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Error en los datos de entrada
- **401 Unauthorized:** Autenticación requerida o token inválido
- **403 Forbidden:** Permisos insuficientes
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto con el estado actual del recurso
- **422 Unprocessable Entity:** Error de validación
- **429 Too Many Requests:** Límite de rate limiting excedido
- **500 Internal Server Error:** Error interno del servidor

### Rate Limiting

La API implementa rate limiting para prevenir abuso y garantizar disponibilidad:

- **Endpoints de autenticación:** 5 peticiones por minuto por IP
- **Endpoints generales:** 100 peticiones por minuto por usuario autenticado
- **Endpoints de administración:** 50 peticiones por minuto por administrador

Cuando se excede el límite, la API devuelve un código 429 con headers informativos:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1625097600
```


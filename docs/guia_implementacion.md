# Guía de Implementación - Agenda de Dragonas (Solución Final)

Esta guía detalla los pasos necesarios para implementar y ejecutar correctamente la aplicación "Agenda de Dragonas", una herramienta digital para mujeres que luchan contra el cáncer.

## Requisitos Previos

- [Docker](https://www.docker.com/get-started) y [Docker Compose](https://docs.docker.com/compose/install/) instalados
- Puertos 5173, 5000 y 3306 disponibles en su sistema
- Conexión a internet para la descarga inicial de imágenes

## Estructura del Proyecto

```
agenda-dragones/
├── frontend/                  # Aplicación React
│   ├── index.html             # Archivo HTML principal (IMPORTANTE: debe estar en la raíz)
│   ├── public/                # Archivos estáticos adicionales
│   ├── src/                   # Código fuente React
│   ├── package.json           # Dependencias frontend
│   ├── vite.config.js         # Configuración de Vite
│   ├── .env                   # Variables de entorno frontend
│   ├── Dockerfile             # Configuración Docker frontend
│   └── nginx.conf             # Configuración de Nginx
├── backend/                   # API Node.js/Express
│   ├── controllers/           # Controladores
│   ├── models/                # Modelos
│   ├── routes/                # Rutas API
│   ├── middleware/            # Middleware
│   ├── utils/                 # Utilidades
│   ├── db/                    # Scripts de actualización BD
│   ├── package.json           # Dependencias backend
│   ├── .env                   # Variables de entorno backend
│   ├── server.js              # Punto de entrada
│   └── Dockerfile             # Configuración Docker backend
├── mysql-init/                # Scripts inicialización MySQL
│   └── 01-schema.sql          # Esquema inicial de la BD
├── docs/                      # Documentación
└── docker-compose.yml         # Configuración Docker Compose
```

## Pasos de Implementación

### 1. Descomprimir el Archivo

Descomprima el archivo del proyecto en la ubicación deseada.

### 2. Verificar Archivos Críticos

Antes de iniciar los contenedores, verifique que estos archivos críticos estén presentes:

- `frontend/index.html` - Archivo HTML principal (DEBE estar en la raíz de frontend, NO en public)
- `frontend/vite.config.js` - Configuración de Vite
- `frontend/src/main.jsx` - Punto de entrada de React
- `docker-compose.yml` - Configuración de Docker Compose

### 3. Iniciar los Contenedores

Abra una terminal en la carpeta raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`) y ejecute:

```bash
docker-compose up -d
```

Este comando iniciará tres contenedores:
- **frontend**: Interfaz de usuario en React (accesible en http://localhost:5173)
- **backend**: API REST en Node.js (accesible en http://localhost:5000)
- **db**: Base de datos MySQL (accesible en localhost:3306)

### 4. Verificar el Estado de los Contenedores

Para asegurarse de que todos los contenedores están funcionando correctamente:

```bash
docker-compose ps
```

Todos los contenedores deberían mostrar el estado "Up".

### 5. Inicializar la Base de Datos

La base de datos se inicializa automáticamente con los scripts en la carpeta `mysql-init`. Sin embargo, para aplicar las actualizaciones del esquema para las nuevas funcionalidades, ejecute:

```bash
docker exec -i agenda-dragones-db mysql -uEva -pDragonas Agenda < ./backend/db/update_schema.sql
```

**Nota importante**: Este comando debe ejecutarse desde la terminal de su sistema operativo, NO desde dentro del contenedor.

### 6. Acceder a la Aplicación

Abra su navegador y acceda a:
- **Interfaz de usuario**: http://localhost:5173

### 7. Credenciales de Prueba

La aplicación viene con tres usuarios predefinidos para pruebas:

1. **Usuario Dragona**:
   - Usuario: dragona
   - Contraseña: Ejemplo

2. **Usuario Médico**:
   - Usuario: doctor
   - Contraseña: Ejemplo

3. **Usuario Administrador**:
   - Usuario: admin
   - Contraseña: Sistema

## Funcionalidades Principales

### Para Dragonas
- Gestión de citas médicas y personales
- Registro de síntomas físicos y emocionales
- Espacio motivacional con frases y logros
- Personalización con pegatinas virtuales
- Configuración de redes sociales (opcional)
- Control de compartición de datos con médicos

### Para Médicos
- Panel con listado de pacientes
- Acceso a datos compartidos por las dragonas
- Visualización de síntomas y evolución
- Respuesta a preguntas y dudas

## Solución de Problemas Comunes

### Error de Build en el Frontend

Si encuentra errores durante el build del frontend como "Could not resolve entry module 'index.html'":

1. **Verifique la ubicación del archivo index.html**:
   - El archivo `index.html` DEBE estar en la raíz de la carpeta frontend, NO en la carpeta public
   - Si el archivo está en frontend/public/index.html, muévalo a frontend/index.html

2. **Verifique la configuración de Vite**:
   - Asegúrese de que el archivo `vite.config.js` contiene la configuración correcta:
   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
     },
     root: './'
   });
   ```

3. **Reconstruya el contenedor frontend**:
   ```bash
   docker-compose down
   docker-compose build --no-cache frontend
   docker-compose up -d
   ```

### Error de Conexión a la Base de Datos

Si el backend no puede conectarse a la base de datos:

1. Verifique que el contenedor de la base de datos esté funcionando:
   ```bash
   docker-compose ps db
   ```

2. Si está funcionando pero sigue habiendo problemas, reinicie los contenedores:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Problemas con la Ejecución de Scripts SQL

Si encuentra errores al ejecutar los scripts SQL:

1. Asegúrese de ejecutar el comando desde la carpeta raíz del proyecto
2. Verifique el nombre correcto del contenedor de la base de datos:
   ```bash
   docker ps | grep mysql
   ```
3. Use el nombre exacto del contenedor en el comando:
   ```bash
   docker exec -i NOMBRE_CONTENEDOR mysql -uEva -pDragonas Agenda < ./backend/db/update_schema.sql
   ```

### Reiniciar la Aplicación

Para reiniciar completamente la aplicación:

```bash
docker-compose down
docker-compose up -d
```

### Reiniciar la Base de Datos

Si necesita reiniciar la base de datos desde cero:

```bash
docker-compose down
docker volume rm agenda-dragones_mysql-data
docker-compose up -d
```

## Personalización

### Variables de Entorno
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=Agenda


Para modificar la configuración, edite los archivos `.env` en las carpetas `frontend` y `backend` antes de construir los contenedores.

### Puertos

Si necesita cambiar los puertos predeterminados, edite el archivo `docker-compose.yml` y modifique las asignaciones de puertos.

## Seguridad

Para un entorno de producción, se recomienda:

1. Cambiar todas las contraseñas predeterminadas
2. Configurar HTTPS para el frontend y backend
3. Implementar políticas de respaldo regulares para la base de datos
4. Revisar y ajustar los permisos de los usuarios

## Contacto y Soporte

Para obtener ayuda adicional o reportar problemas, contacte al equipo de desarrollo SiriCat o Eva María Pérez.

---

© 2025 Agenda de Dragonas - Todos los derechos reservados

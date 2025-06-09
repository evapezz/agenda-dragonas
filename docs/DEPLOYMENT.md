# Guía de Despliegue - Agenda Digital de Dragonas

## Entornos de Despliegue

### Desarrollo Local

**Prerrequisitos:**
- Node.js 18.0+
- MySQL 8.0+
- Git

**Configuración:**
```bash
# Clonar repositorio
git clone https://github.com/tu-organizacion/agenda-dragonas.git
cd agenda-dragonas

# Backend
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Staging/Testing

**Con Docker Compose:**
```bash
# Configurar entorno de staging
cp docker-compose.yml docker-compose.staging.yml

# Modificar variables para staging
export NODE_ENV=staging
export DB_NAME=agenda_dragonas_staging

# Desplegar
docker-compose -f docker-compose.staging.yml up -d

# Ejecutar tests
docker-compose exec backend npm test
```

### Producción

#### Opción 1: Docker Compose (Recomendado)

**Archivo docker-compose.prod.yml:**
```yaml
services:
  # Base de datos MySQL (XAMPP / host.docker.internal)
  mysql:
    image: mysql:8.0
    container_name: agenda-dragonas-db
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ""         # root sin password
      MYSQL_DATABASE: Agenda          # tu BD
      MYSQL_USER: Eva                 # usuario de tu aplicación
      MYSQL_PASSWORD: Dragonas        # contraseña de Eva
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-init:/docker-entrypoint-initdb.d
    networks:
      - agenda-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: agenda-dragonas-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000

      DB_DIALECT: mysql
      DB_HOST: host.docker.internal   # para conectar al XAMPP/MySQL en tu host
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: ""                 # cadena vacía
      DB_NAME: Agenda

      JWT_SECRET: DAW2025
      CORS_ORIGIN: http://localhost:5173
      FRONTEND_URL: http://localhost:5173
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    depends_on:
      - mysql
    networks:
      - agenda-network

  # Frontend React (sirviendo los archivos estáticos con Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: agenda-dragonas-web
    restart: unless-stopped
    ports:
      - "5173:80"                     # expone el 80 del contenedor en el 5173 local
    environment:
      VITE_API_URL: http://localhost:5000/api
      VITE_APP_NAME: Agenda Digital Dragonas
      VITE_APP_VERSION: 2.0.0
    depends_on:
      - backend
    networks:
      - agenda-network

volumes:
  mysql_data:
    driver: local

networks:
  agenda-network:
    driver: bridge

**Despliegue:**
```bash
# Configurar variables de producción
cp backend/.env.example backend/.env.prod
# Editar .env.prod con valores de producción

# Construir y desplegar
docker-compose -f docker-compose.prod.yml up --build -d

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

#### Opción 2: Servidor Tradicional

**Configuración del Servidor:**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt update
sudo apt install mysql-server

# Instalar Nginx
sudo apt install nginx

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2
```

**Configuración de la Aplicación:**
```bash
# Clonar en servidor
git clone https://github.com/tu-organizacion/agenda-dragonas.git
cd agenda-dragonas

# Backend
cd backend
npm ci --production
cp .env.example .env
# Configurar variables de producción
npm run migrate
npm run seed

# Frontend
cd ../frontend
npm ci
npm run build

# Configurar PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Archivo ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'agenda-dragonas-backend',
    script: './backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Configuración de Nginx

**Archivo /etc/nginx/sites-available/agenda-dragonas:**
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend Static Files
    location / {
        root /path/to/agenda-dragonas/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Backend
    location /api {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting for auth endpoints
    location /api/auth {
        limit_req zone=login burst=5 nodelay;
        
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Habilitar configuración:**
```bash
sudo ln -s /etc/nginx/sites-available/agenda-dragonas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run

# Configurar cron para renovación
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Base de Datos en Producción

### Configuración MySQL

**Archivo /etc/mysql/mysql.conf.d/mysqld.cnf:**
```ini
[mysqld]
# Performance
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M

# Security
bind-address = 127.0.0.1
skip-networking = false
local-infile = 0

# Logging
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### Backup Automatizado

**Script de backup (/opt/scripts/backup-mysql.sh):**
```bash
#!/bin/bash

# Variables
DB_NAME="agenda_dragonas"
DB_USER="backup_user"
DB_PASS="backup_password"
BACKUP_DIR="/opt/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/agenda_dragonas_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/agenda_dragonas_$DATE.sql

# Eliminar backups antiguos (mantener 30 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: agenda_dragonas_$DATE.sql.gz"
```

**Configurar cron:**
```bash
# Backup diario a las 2:00 AM
0 2 * * * /opt/scripts/backup-mysql.sh
```

## Monitoreo y Logs

### Configuración de Logs

**Backend (winston):**
```javascript
// backend/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### Monitoreo con PM2

```bash
# Monitorear procesos
pm2 monit

# Ver logs en tiempo real
pm2 logs

# Estadísticas
pm2 show agenda-dragonas-backend

# Reiniciar aplicación
pm2 restart agenda-dragonas-backend

# Recargar sin downtime
pm2 reload agenda-dragonas-backend
```

## Actualizaciones y Mantenimiento

### Script de Despliegue

**deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Iniciando despliegue..."

# Backup de base de datos
echo "📦 Creando backup de base de datos..."
/opt/scripts/backup-mysql.sh

# Actualizar código
echo "📥 Actualizando código..."
git pull origin main

# Backend
echo "🔧 Actualizando backend..."
cd backend
npm ci --production
npm run migrate

# Frontend
echo "🎨 Construyendo frontend..."
cd ../frontend
npm ci
npm run build

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
pm2 reload ecosystem.config.js

# Verificar salud
echo "🏥 Verificando salud de la aplicación..."
sleep 10
curl -f http://localhost:5000/api/health || exit 1

echo "✅ Despliegue completado exitosamente!"
```

### Rollback

**rollback.sh:**
```bash
#!/bin/bash

echo "⏪ Iniciando rollback..."

# Obtener último commit estable
LAST_STABLE=$(git log --oneline -n 10 | grep "stable" | head -1 | cut -d' ' -f1)

if [ -z "$LAST_STABLE" ]; then
    echo "❌ No se encontró commit estable"
    exit 1
fi

echo "🔄 Rollback a commit: $LAST_STABLE"

# Rollback código
git checkout $LAST_STABLE

# Reconstruir y reiniciar
./deploy.sh

echo "✅ Rollback completado"
```

## Checklist de Producción

### Pre-despliegue
- [ ] Variables de entorno configuradas
- [ ] Certificados SSL instalados
- [ ] Base de datos migrada
- [ ] Backup de datos actual
- [ ] Tests pasando
- [ ] Performance optimizada

### Post-despliegue
- [ ] Aplicación accesible
- [ ] APIs respondiendo
- [ ] Base de datos conectada
- [ ] Logs funcionando
- [ ] Monitoreo activo
- [ ] Backup programado

### Seguridad
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] Rate limiting activo
- [ ] Firewall configurado
- [ ] Accesos restringidos
- [ ] Logs de seguridad activos

## Solución de Problemas

### Problemas Comunes

**Error de conexión a base de datos:**
```bash
# Verificar estado de MySQL
sudo systemctl status mysql

# Verificar logs
sudo tail -f /var/log/mysql/error.log

# Reiniciar MySQL
sudo systemctl restart mysql
```

**Aplicación no responde:**
```bash
# Verificar procesos PM2
pm2 status

# Ver logs de errores
pm2 logs --err

# Reiniciar aplicación
pm2 restart all
```

**Problemas de SSL:**
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Verificar configuración Nginx
sudo nginx -t
```

### Contacto de Soporte

- **Email**: devops@agenda-dragonas.com
- **Slack**: #devops-support
- **Documentación**: https://docs.agenda-dragonas.com


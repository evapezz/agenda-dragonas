# Etapa de producción del backend
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias y solo instalar producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Exponer el puerto en el que corre tu app
EXPOSE 5000

# Comando para arrancar el servidor
CMD ["node", "server.js"]

FROM node:22-alpine

WORKDIR /app

# 1) Primero solo los package*.json: Docker reutiliza esta capa (y el npm ci)
#    mientras las dependencias no cambien, aunque cambie el código.
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Después el código.
COPY . .

EXPOSE 3000

# No correr como root dentro del contenedor.
USER node

CMD ["node", "server.js"]
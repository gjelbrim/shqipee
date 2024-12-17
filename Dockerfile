# Node.js-Umgebung
FROM node:22.9-alpine

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install

# Code kopieren und bauen
COPY . .
RUN npm run build

# Svelte App starten
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host"]

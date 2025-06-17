FROM node:18-alpine

WORKDIR /app

# Instalar utilitários para o script de espera
RUN apk add --no-cache netcat-openbsd bash

COPY package*.json ./

RUN npm install

COPY . .

# Dar permissão de execução ao script de entrypoint
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

# Usar um shell para que possamos usar o script de espera
CMD ["/bin/bash", "/app/entrypoint.sh"]

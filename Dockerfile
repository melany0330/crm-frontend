# Etapa donde se construye el build
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_WMS_PROTOCOL
ARG VITE_WMS_NAME
ARG VITE_WMS_PORT
ARG VITE_WMS_API_AUTH
ENV VITE_WMS_PROTOCOL=${VITE_WMS_PROTOCOL}
ENV VITE_WMS_NAME=${VITE_WMS_NAME}
ENV VITE_WMS_PORT=${VITE_WMS_PORT}
ENV VITE_WMS_API_AUTH=${VITE_WMS_API_AUTH}

RUN npm run build

# Etapa de producción para servir el frontend con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
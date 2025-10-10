#  WMS Frontend E-Commerce

Este es el proyecto de frontend del grupo numero 5, que consta de de una plantilla para comercio electronico Bootstrap versátil y flexible con una licencia regular.

## Autores

**WMS** – (Frontend developer)

- **W**ilson Martín Cabrera Juárez
- **M**elany Belen Ambrocio Nelson
- **S**ebastian Rocop Quemé

---

## Tecnologías usadas

- [ReactJS](https://reactjs.org/)
- [ViteJS](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- HTML5, CSS3, JavaScript (ES6+)

## Licencia

Este proyecto utiliza una plantilla de pago bajo una licencia regular de uso de ThemeForest.
No se permite la redistribución, sublicencia o reventa del código fuente original.

### Prerrequisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.x
- Recomendado: Visual Studio Code
  
## Comandos para iniciar

Clona el repositorio:

```bash
   git clone https://github.com/Progra-Comercial-2025/grupo5-frontend.git
```

Construir y ejecutar:

```bash
   cd grupo5-frontend
    - npm install
    - npm run dev
```
### Docker

Construir y ejecutar el frontend usando Docker y Nginx.

---

#### 1. Construir la imagen Docker

```bash
docker build \
  --build-arg VITE_WMS_PROTOCOL= \
  --build-arg VITE_WMS_NAME= \
  --build-arg VITE_WMS_PORT= \
  --build-arg VITE_WMS_API_AUTH= \
  -t sebasssr7/wms-frontend:latest .
```
---

#### 2. Descargar y correr la imagen Docker
```bash
docker pull sebasssr7/wms-frontend:latest
docker run -d -p 80:80 --name wms-frontend sebasssr7/wms-frontend:latest
```



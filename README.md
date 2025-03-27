# ⚽ Futbol Manager

**Futbol Manager** es una aplicación en Node.js con Express y MongoDB que permite registrar jugadores y generar partidos de fútbol de manera sencilla.

## 🚀 Características
- 📌 Registro de jugadores con nombre y media.
- ⚽ Creación de partidos equilibrados.
- 🛠️ API REST con Express y MongoDB.
- 🔄 Conexión con frontend a través de CORS.

## 🛠️ Instalación y Configuración
1. Clona este repositorio:
   ```sh
   git clone https://github.com/alejorendons/futbol-manager
   cd futbol-manager
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Asegúrate de tener MongoDB corriendo en `localhost:27017` o configura la conexión en `server.js`.
4. Inicia el servidor:
   ```sh
   npm start
   ```

## 📌 Endpoints
### 🔹 Registrar jugador
**POST** `/guardar-jugador`
```json
{
  "nombre": "Lionel Messi",
  "media": 95
}
```

### 🔹 Obtener jugadores
**GET** `/obtener-jugadores`

## 📜 Licencia
Este proyecto está bajo la licencia MIT. ¡Siéntete libre de contribuir!

---
😃 **Contribuciones y mejoras son bienvenidas!**


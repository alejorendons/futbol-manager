const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/jugadoresDB';

// Configuración optimizada de MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error MongoDB:', err));

// Modelo de Jugador
const Jugador = mongoose.model('Jugador', new mongoose.Schema({
    nombre: { type: String, required: true },
    media: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true }));

// Configuración mejorada del servidor HTTP/WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
    pingTimeout: 60000,       // 60 segundos para timeout
    pingInterval: 25000,      // 25 segundos entre pings
    upgradeTimeout: 10000,    // 10 segundos para upgrade
    cookie: false,
    transports: ['websocket'], // Forzar WebSocket solamente
    allowUpgrades: false,     // Deshabilitar upgrades
    perMessageDeflate: {
        threshold: 1024       // Comprimir mensajes > 1KB
    },
    httpCompression: true,
    maxHttpBufferSize: 1e8    // 100MB máximo
});

// Almacén de sesiones activas
const activeSessions = new Map();

io.on('connection', (socket) => {
    const clientId = socket.handshake.query.clientId;
    const sessionId = socket.handshake.sessionId || `sess-${Date.now()}`;

    console.log(`🔌 Nueva conexión: ${clientId} (${socket.id})`);

    // Registrar sesión
    activeSessions.set(clientId, {
        socketId: socket.id,
        lastActive: Date.now(),
        sessionId: sessionId
    });

    // Configurar heartbeat
    const heartbeatInterval = setInterval(() => {
        if (socket.connected) {
            socket.emit('heartbeat', { timestamp: Date.now() });
        }
    }, 20000);

    // Manejar mensajes de actividad
    socket.on('activity', () => {
        const session = activeSessions.get(clientId);
        if (session) {
            session.lastActive = Date.now();
        }
    });

    // Manejar desconexión
    socket.on('disconnect', (reason) => {
        clearInterval(heartbeatInterval);
        
        console.log(`⚠️ Desconexión: ${clientId} (${socket.id}) - Razón: ${reason}`);
        
        // No eliminar inmediatamente para permitir reconexión rápida
        setTimeout(() => {
            if (activeSessions.get(clientId)?.socketId === socket.id) {
                activeSessions.delete(clientId);
                console.log(`♻️ Sesión finalizada: ${clientId}`);
            }
        }, 10000); // Esperar 10 segundos
    });

    // Manejar errores
    socket.on('error', (err) => {
        console.error(`🚨 Error en ${clientId}:`, err);
    });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas API (ejemplo)
// Configuración de rutas
app.get('/obtener-jugadores', async (req, res) => {
    try {
        const jugadores = await Jugador.find().sort({ createdAt: -1 });
        res.json(jugadores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/guardar-jugador', async (req, res) => {
    try {
        const { nombre, media } = req.body;
        if (!nombre || isNaN(media)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const nuevoJugador = new Jugador({ nombre, media });
        await nuevoJugador.save();
        
        // Emitir la lista actualizada
        const jugadoresActualizados = await Jugador.find().sort({ createdAt: -1 });
        io.emit('jugadores-actualizados', jugadoresActualizados);
        
        res.status(201).json(nuevoJugador);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
});
// Generador de ID de cliente persistente
const getClientId = () => {
    let clientId = localStorage.getItem('socket:client:id');
    
    if (!clientId) {
        clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
        localStorage.setItem('socket:client:id', clientId);
    }
    
    return clientId;
};

// Configuración optimizada de Socket.IO
const socket = io({
    query: {
        clientId: getClientId(),
        sessionId: `sess-${Date.now()}`
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
    transports: ['websocket'],
    upgrade: false,
    rememberUpgrade: false,
    forceNew: false,
    multiplex: true
});

// Sistema de heartbeat
let heartbeatInterval;
let lastActivity = Date.now();

const setupHeartbeat = () => {
    clearInterval(heartbeatInterval);
    
    heartbeatInterval = setInterval(() => {
        if (socket.connected) {
            socket.emit('activity', { 
                timestamp: Date.now(),
                page: window.location.pathname
            });
        }
    }, 15000);
};

// Manejo de conexión
socket.on('connect', () => {
    console.log('✅ Conexión establecida con ID:', socket.id);
    updateStatus('Conectado', '#4CAF50');
    setupHeartbeat();
    lastActivity = Date.now();
});

// Manejo de desconexión
socket.on('disconnect', (reason) => {
    console.log('❌ Desconectado. Razón:', reason);
    updateStatus('Desconectado', '#F44336');
    
    if (reason === 'io server disconnect') {
        setTimeout(() => socket.connect(), 1000);
    }
});

// Reconexión progresiva
socket.on('reconnect_attempt', (attempt) => {
    console.log(`🔁 Intentando reconectar (intento ${attempt})`);
    updateStatus(`Reconectando... (${attempt})`, '#FF9800');
});

socket.on('reconnect', (attempt) => {
    console.log(`♻️ Reconectado después de ${attempt} intentos`);
    updateStatus('Conectado', '#4CAF50');
    lastActivity = Date.now();
});

// Manejo de errores
socket.on('connect_error', (err) => {
    console.error('🚨 Error de conexión:', err.message);
    updateStatus('Error de conexión', '#F44336');
});

// Actualizar estado en UI
function updateStatus(text, color) {
    const statusElement = document.getElementById('socket-status');
    if (statusElement) {
        statusElement.textContent = text;
        statusElement.style.color = color;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupHeartbeat();
    
    // Manejar navegación entre páginas
    window.addEventListener('beforeunload', () => {
        socket.emit('navigation', {
            from: window.location.pathname,
            timestamp: Date.now()
        });
    });
});

export { socket };
import { socket } from './socket-client.js';

const notificationList = document.getElementById('notification-list');

socket.on('nuevo-jugador', (jugador) => {
    const notificationItem = document.createElement('li');
    notificationItem.textContent = `Nuevo jugador: ${jugador.nombre} (Media: ${jugador.media})`;
    notificationList.appendChild(notificationItem);

    if (notificationList.children.length > 5) {
        notificationList.removeChild(notificationList.firstChild);
    }
});

socket.on('connect', () => {
    const connectionItem = document.createElement('li');
    connectionItem.textContent = `Conectado al servidor`;
    notificationList.appendChild(connectionItem);
});

socket.on('disconnect', () => {
    const disconnectionItem = document.createElement('li');
    disconnectionItem.textContent = `Desconectado del servidor`;
    notificationList.appendChild(disconnectionItem);
});